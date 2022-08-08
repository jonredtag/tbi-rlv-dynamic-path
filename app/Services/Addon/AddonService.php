<?php
namespace App\Services\Addon;
use App\Models\BookingHistory;
use App\Models\TransferBooking;
use App\Models\ActivityBooking;
use Illuminate\Support\Facades\Cache;

class AddonService
{
    protected $addonRepo;
   
    public function __construct($addonRepo)
    {
        $this->addonRepo = $addonRepo;
        $this->addon = []; //can config here

        if (config('features.transfer')) {
            $this->addon[] = 'transfer';
        }

        if (config('features.activity')) {
            $this->addon[] = 'activity';
        }

        $this->exchangeRate = array(
            'USD' => 0.7438,
            'CAD' => 1,
            'EUR' => 0.64447,
            'GBP' => 0.58469,
            'CHF' => 0.69388,
         );
    }

    public function search($params)
    {
            $sid = $params['sid'];
            $numRecords =  $params['numRecords']??5;
            $searchParameters = app('packageService')->getParameters($sid);
            $pax = ['adults' => 0, 'children' => 0, 'infants' => 0];
            $ages = [];
            //add the logic to check infants 
            foreach ($searchParameters['occupancy'] as $room) {
                $pax['adults'] += $room['adults'];
                $pax['children'] += $room['children'];
                for($i=0;$i<$room['adults']; $i++){
                    array_push($ages,'19');
                }
                if($room['children']){
                    $ages = array_merge( $ages,$room['ages']);
                }
            }
            $pax['ages'] = $ages;
            $productData = app('packageService')->getProduct();
            $packageVfTime = $sid.'-'.app('packageService')->getPackageVfTimestamp();
            if(!empty($productData)){
                    $sessionData = app('packageService')->getSession($sid, 'addon');
                    if(!($sessionData && ($sessionData['packageVfTimeStamp'] == $packageVfTime))){                           
                        //new package verify,trick to clean the previous transfer selection 
                        unset($sessionData['selectedInfo']); 
                        $searchParam =  array(
                            'pax' => $pax,
                        );
                        foreach($this->addon  as $prod){
                            $searchParam[$prod] = app($prod.'Service')->formatSearchParam($productData, $pax);
                        }
                        $sessionData['packageVfTimeStamp'] = $packageVfTime;
                        $searchRet = $data = $this->addonRepo->search($searchParam);
                        foreach($searchRet as $prod=>$detail){
                             $results =  app($prod.'Service')->translateSearch($detail,$searchParam[$prod]);
                             if(isset($results['sessionId'])){
                                $sessionId = $results['sessionId'];
                                app('packageService')->addSession($sid,['sessionId'=>$sessionId,'searchParam'=>$searchParam[$prod]], $prod);
                                \Cache::put($prod."-results-".$sessionId, $results, 1800);
                             }
                         }
                        app('packageService')->addSession($sid,$sessionData, 'addon');
                    }
                    foreach($this->addon as $prod) {
                        $data[$prod] =  app($prod.'Service')->paginate(['sid'=>$sid, 'page'=>0,'numRecords'=>$numRecords]);
                    }
            } else {
                $data = ['error'=>["code" => "s-01","message" => "Your booking session has expired would you like to restart?"]]; 
            }
         return $data;
    }
    
    public function add($params){ //activity id : 1-1,
        $sid =  $params['sid'];
        $id =  $params['id'];
        $addonType =  $params['type'];
        if(!in_array($addonType, $this->addon)){
            return ['error'=>['code'=>'S-02','message'=>'You request wrong addon type, please check!']];
        }
        $sessionData = app('packageService')->getSession($sid, 'addon');
        if($sessionData){
           //need make sure the params have the pax information 
           $results =  app($addonType."Service")->add($params);
           $sessionData['selectedInfo'][$addonType] = array(
                'fare'=>$results['fare'],
           ) ;
           $totalAmount = 0;
           foreach($this->addon as $prod){
                if(isset($sessionData['selectedInfo'][$prod])){
                      $totalAmount += $sessionData['selectedInfo'][$prod]['fare'];
                }
            }
            $sessionData['selectedInfo']['totalAmount'] = $data['totalAmount'] =  $totalAmount;
            app('packageService')->addSession($sid,$sessionData, 'addon');
            $data[$addonType] =  $results;
       } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
       }
       return $data;        
    }
    
    public function remove($params){
        $sid =  $params['sid'];
        $id =  $params['id'];
        $addonType =  $params['type'];
        if(!in_array($addonType, $this->addon)){
            return ['error'=>['code'=>'S-02','message'=>'You request wrong addon type, please check!']];
        }
        $sessionData = app('packageService')->getSession($sid, 'addon');
        if($sessionData){
               $results =  app($addonType."Service")->remove($params);
               $sessionData['selectedInfo'][$addonType] = array(
                    'fare'=>$results['fare'],
               ) ;
               $totalAmount = 0;
               foreach($this->addon as $prod){
                    if(isset($sessionData['selectedInfo'][$prod])){
                          $totalAmount += $sessionData['selectedInfo'][$prod]['fare'];
                    }
                }
                $sessionData['selectedInfo']['totalAmount'] = $data['totalAmount'] =  $totalAmount;
                app('packageService')->addSession($sid,$sessionData, 'addon');
                $data[$addonType] =  $results;
       } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
       }
       return $data;
    }
    
    public function getSelectedProducts($sid){
         $sessionData = app('packageService')->getSession($sid, 'addon');
         $data = $sessionData['selectedInfo'];
         foreach($this->addon as $prod){
            $prodInfo = app('packageService')->getSession($sid, $prod);
            if(isset($prodInfo['selectedInfo'])){
                $data[$prod] =  $prodInfo['selectedInfo'];
            }
        }
        if(isset($data['activity'])){ //check the questions
            $questFilters = ['FLIGHTNUMBER','FLIGHTTIME','FLIGHTAIRPORT',
                'HOTEL_NAME', 'DIRECCIONHTL','EMAIL','NC-CTEL','PAX_NAME','PHONENUMBER'];
            
            foreach($data['activity']['results'] as $key=>$item){
                if(isset($item['questions'])){
                    $questions = [];
                    foreach($item['questions'] as $ques){
                         if(in_array($ques['code'],$questFilters)){
                             continue;
                         }
                         $questions[] = $ques;
                    }
                    if(count($questions)){
                        $data['activity']['results'][$key]['questions'] = $questions;
                    } else {
                        unset( $data['activity']['results'][$key]['questions']);
                    }
                }
            }
        }
        return $data;
    }
   
    public function resetSelectedProducts($sid){
         app('packageService')->removeSession($sid, 'addon');
         foreach($this->addon as $prod){
                app('packageService')->removeSession($sid, $prod);
        }
    }
   
     public function book($params, $bookingID)
    {  
        $sid = $params['sid'];
        $selectInfo = $params['selectInfo']; 
        $activitysessionData = isset($selectInfo['activity'])? app('packageService')->getSession($sid, 'activity'):null;
        $transferSessionData = isset($selectInfo['transfer'])? app('packageService')->getSession($sid, 'transfer'):null;
       
        $activityBookData  = $activitysessionData['selectedInfo']??null;
        if(!empty($activityBookData)){
            $activityBookData['searchParam'] =   $activitysessionData['searchParam'];
            $activityBookData['additionalAnswers'] =   $params['activityAnswers'];
        }
        $transferBookData  = $transferSessionData['selectedInfo']??null;
        if(!empty($transferBookData)){
            $transferBookData['searchParam'] = $transferSessionData['searchParam'];
        }
        $addonBookParams = array(
             'lang'=>$params['lang'],
             'paxs'=>$params['paxs'],  
             'activity'=>$activityBookData,
             'transfer'=>$transferBookData,
             'packageBookingId'=>$bookingID,
         );
        list($reqData, $resData) = $this->addonRepo->book($addonBookParams);        
        $history = new BookingHistory;
        $history->booking_id = $bookingID;
        if(count($reqData) >1) {
                $history->action = 'addon';
                $history->request =   json_encode($reqData);
                $history->response = json_encode($resData);
                $history->save();             
        } else { //only one addon, show the particular infor
            foreach($resData as $key=>$response){
                $history->action = $key;
                $history->request =   json_encode($reqData[$key]);
                $history->response = json_encode($response);
                $history->save();             
            }  
        }         
        return $resData;
    }
        
    public function logBooking($data, $sid, $paxs,$bookingID)
    {
        foreach($data as $prod=>$bookRd) {
             $parsedData[$prod] =  app($prod."Service")->logBooking($bookRd,$sid, $paxs,$bookingID);
        }
        return $parsedData;         
    }
    
    
}
