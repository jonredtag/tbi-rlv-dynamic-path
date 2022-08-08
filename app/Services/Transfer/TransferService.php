<?php
namespace App\Services\Transfer;
use App\Models\BookingHistory;
use App\Models\TransferBooking;
use Illuminate\Support\Facades\Cache;

class TransferService
{
    protected $transferRepo;
   
    public function __construct($transferRepo)
    {
        $this->transferRepo = $transferRepo;
        $this->exchangeRate = array(
            'USD' => 0.7438,
            'CAD' => 1,
            'EUR' => 0.64447,
            'GBP' => 0.58469,
            'CHF' => 0.69388,
         );
    }

    public function search($sid)
    {
         
    }
    
    public function paginate($param){
        $data = ['totalResults'=>0,'list'=>[]];
        $sid = $param['sid'];
        $page =  $param['page']??0;
        $numRecords = $param['numRecords']??5;
        $start = $page * $numRecords; 
        $sessionData =  app('packageService')->getSession($sid,'transfer');
        if($sessionData){
            $cacheData =  \Cache::get("transfer-results-".$sessionData['sessionId']);
            if($cacheData && isset($cacheData['list'])){
                $filterIndexData =  array_keys($cacheData['list']);
                if(count($filterIndexData)){
                    $data['totalResults'] =  count($filterIndexData);
                    $indexResults = array_splice($filterIndexData, $start, $numRecords);
                    foreach ($indexResults as $id) {
                        $data['list'][] = $cacheData['list'][$id];
                    }
                }
           } else {
                 $data = ['error'=>["code" => "s-01","message" => "Your booking session has expired would you like to restart?"]]; 
            } 
        } else {
            $data = ['error'=>["code" => "s-01","message" => "Your booking session has expired would you like to restart?"]]; 
        }
        return $data;
    }
    
    public function formatSearchParam($productData,$pax=null){
        $hotelBedsCode = $productData['hotel']['hotelBedsCode'];
        $hotelLocation = $productData['hotel']['location'];
        $depTimeObj =  new \DateTime($productData['flight']['depDestTime']);
        $arrTimeObj =  new \DateTime($productData['flight']['arrDestTime']);
        $depTime =  $depTimeObj->format("Y-m-d")."T".$depTimeObj->format("H:i:s");
        $arrTime =  $arrTimeObj->format("Y-m-d")."T".$arrTimeObj->format("H:i:s");
        
        $searchParam =  array(
            'airportCode' => $productData['flight']['destAirport'],
            'outbound' =>  $arrTime,
            'inbound' => $depTime,
            'depFlightCode'=> $productData['flight']['depFlightInfo']['carrier']." ".$productData['flight']['depFlightInfo']['number'],
            'arrFlightCode'=> $productData['flight']['arrFlightInfo']['carrier']." ".$productData['flight']['arrFlightInfo']['number'],
            'hotelBedsCode' => $hotelBedsCode,
            'hotelName'=>$productData['hotel']['hotelName'],
            'hotelGeo'=>$hotelLocation,
        );
        return $searchParam;
    }
    
    public function add($params){ //activity id : 1-1,
        $sid =  $params['sid'];
        $id =  $params['id'];
        $sessionData =  app('packageService')->getSession($sid,'transfer');
        if($sessionData){
            $resultsData =  \Cache::get("transfer-results-".$sessionData['sessionId']);
            if($resultsData){
                $results = $sessionData['selectedInfo']??[];
                if(!empty($results)){
                    $options =  array_keys($results['results']);
                }
                $options[] = $id;
                $options = array_unique($options);
                $data =  $this->_translateSelected($resultsData['list'], $options);
                $data['sessionId'] = $resultsData['sessionId'];
                $sessionData['selectedInfo']  = $data ;      
                app('packageService')->addSession($sid,$sessionData, 'transfer');            
           } else {
                $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
           }            
        }  else {
             $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
        }               
       return $data;        
    }
    
    public function remove($params){
        $sid =  $params['sid'];
        $id =  $params['id'];
        $sessionData = app('packageService')->getSession($sid, 'transfer');
        if($sessionData){
             $results = $sessionData['selectedInfo']['results']??[];
             if(!empty($results)){
                 $totalAmount  =  $sessionData['selectedInfo']['fare'];
                 $totalAmount -= $results[$id]['price']['totalAmount'];
                unset($results[$id]);
                $sessionData['selectedInfo']['fare'] =  $totalAmount;
                $sessionData['selectedInfo']['results']   =  $results;    
                $data =  $sessionData['selectedInfo'];
                app('packageService')->addSession($sid,$sessionData, 'transfer');
            } else {
                $data =  ['error'=>['code'=>'S-404','message'=>'It seems you had no that item at all']];
            }
       } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
       }
       return $data;
    }
    
     public function translateSearch($detail)
    {  
        if(!(isset($detail['data']['transfersResults']['services']) || isset($detail['services'])) ){
            return ['sessionId'=>$detail['data']['session']['id']??time(), 'list'=> []];
        }
        $oriResults = $detail['data']['transfersResults']['services']??$detail['services'];
        foreach($oriResults as $item){
            $item['tripkey'] =  md5($item['transferType']. json_encode($item['vehicle']));
            $results[] =  $item; 
        }
        
        $departList =  array_filter($results, function($item){
            return strtolower($item['direction'])   ==='departure';
        });
        $returnList =  array_filter($results, function($item){
            return strtolower($item['direction']) ==='return';
        });
        $roundTripList = $this->_parseTransferInfo($departList,$returnList) ;
        $returnData = ['sessionId'=>$detail['data']['session']['id']??time(), 'list'=> $roundTripList];
        return $returnData;
    }
    
     private function _parseTransferInfo($arrivalList,$departureList)
    {
        $roundTripList = [];
        $sortArr = [];
        $index =0;
        $roundTripListReturn = [];
        foreach($arrivalList as  $i=>$item){
            $tripkey = $item['tripkey'];
            $returnItem =  array_filter($departureList, function($entry) use ($tripkey){
                return ($entry['tripkey'] == $tripkey);
            });
            if($returnItem){
                 $index++;
                 $matched[] = $i;   
                 $retData = array_pop($returnItem);
                 $image = isset($item['content']['images'])? array_filter($item['content']['images'], 
                        function($img){
                            return strtolower($img['type'])=='large';
                        }):[]; 
                $imgData =  array_pop($image);   
                $currencyId = $item['price']['currencyId'];
                $amount = $item['price']['totalAmount'] + $retData['price']['totalAmount'];
                $airportInfo = $item['pickupInformation']['from'];        
                $serviceName = $item['transferType']." ".$item['category']['name']." ".$item['vehicle']['name'];
                $emergencyContact =  $item['sourceMarketEmergencyNumber']??'';
                $arrPickUpDate =  new \DateTime($item['pickupInformation']['date']."T".$item['pickupInformation']['time']);
                $item['pickupInformation']['formatTime'] = $arrPickUpDate->format("l. M d, Y, h:i A");
                $depPickUpDate =  new \DateTime($retData['pickupInformation']['date']."T".$retData['pickupInformation']['time']);
                $retData['pickupInformation']['formatTime'] = $depPickUpDate->format("l. M d, Y, h:i A");
                $roundTripList[] = array(
                    'rowId'=>$index,
                    'airport'=>(!empty($airportInfo['description'])? explode(",",$airportInfo['description'])[1]:'')."(".$airportInfo['code'].")",
                    'hotel'=>$item['pickupInformation']['to']['description'],
                    'desc'=>['arr'=>$this->_parseTransferDesc($item),'dep'=>$this->_parseTransferDesc($retData)],
                    'rateKeys'=>['depId'=>$item['id'], 'dep'=>$item['rateKey'],'arrId'=>$retData['id'],'arr'=>$retData['rateKey']],
                    'price'=>array(
                            'oriAmount'=>$amount, 
                            'currencyId'=>$currencyId,
                            'totalAmount'=>number_format($amount/$this->exchangeRate[$currencyId],2,'.','')
                            ),
                    'thumbImg'=> !empty($imgData)?$imgData['url']:null,
                    'transferType'=>ucfirst(strtolower($item['transferType'])),
                    'vehicle'=>$item['vehicle'],
                    'maxCapacity'=>isset($item['maxPaxCapacity'])?$item['maxPaxCapacity']:null,
                    'pickupInformation' =>['arr'=>$item['pickupInformation'],'dep'=>$retData['pickupInformation']],
                    'serviceName'=>$serviceName,  
                    'emergencyContact'=>$emergencyContact, 
                    ) ;  
                    $sortArr[] = $amount;
                } else {
                     $nonMatched[] = $i;   
                }
        }
        asort($sortArr);
        foreach($sortArr as $index=>$val){
            $roundTripListReturn[] =  $roundTripList[intval($index)];
        }
        return $roundTripListReturn;              
    }
    
    private function _translateSelected($list, $options){
        $totalAmount = 0;
        $selectItems = [];
        if(!empty($list)){
            foreach($options as $id){
                $item = null;
                $findItem =  array_filter($list, function($l) use($id) { return ($l['rowId'] == $id);});
                if($findItem){
                    $item =  array_pop($findItem);
                }
                if(!empty($item)){
                    $selectItems[$id] = $item; 
                    $totalAmount  +=  $item['price']['totalAmount'];
                }
            }
        }
        // may add translation for the $selectItems;
        return ['results'=>$selectItems,'fare'=>$totalAmount];
    }
    
    
     public function logBooking($bookRd, $sid, $paxs,$bookingID)
    {
         $mainPax = $paxs[0];
         $holder =  array(
             'title'=>$mainPax['title'],
             'name'=>$mainPax['first'].(!empty($mainPax['middle'])?' '.$mainPax['middle']:''),
             'surname'=>$mainPax['last'],
             'email'=>$mainPax['email'],
             'phone'=> str_replace("-", "", $mainPax['phone']),
         );  
        if(isset($bookRd['bookings'][0])){
            $bookingInfo = $bookRd['bookings'][0];
            $bookDate =  new \DateTime($bookingInfo['creationDate']);
            $translatedInfo =  $this->_translateBookDetail($bookingInfo['transfers']);
            $supplier = $bookingInfo['supplier']['name'];
            $parsedTransfer = $translatedInfo;
            $holder =  $bookingInfo['holder'];
            $bookingNumber =  $bookingInfo['status'] =='CONFIRMED' ? $bookingInfo['reference'] : 'PENDING';
            $amount = $bookingInfo['totalAmount'];
            $currencyId = $bookingInfo['currency'];
            $totalAmount = number_format($amount/$this->exchangeRate[$currencyId]);
        } else {
             $sessionData = app('packageService')->getSession($sid, 'transfer');
             $parsedTransfer = array_values($sessionData['selectedInfo']['results']);
             $bookDate =  new \DateTime();
             $bookingNumber = "PENDING";
             $supplier=null;
             $totalAmount = $sessionData['selectedInfo']['fare'];
        }
        $parsedData =  [
                'supplier'=>$supplier,
                'totalAmount'=> $totalAmount,
               "bookingNumber" => $bookingNumber ,
               "bookDate"=> $bookDate->format("Y-m-d H:i:s"),
               "tripInfo"=>$parsedTransfer,
               'holder'=>$holder,
           ];
        $bookingEngine = new TransferBooking;         
        $bookingEngine->booking_number = $parsedData['bookingNumber']??'';
        $bookingEngine->booking_id = $bookingID;
        $bookingEngine->booking_data = json_encode($parsedData);
        $bookingEngine->booking_status = isset($parsedData['bookingInfo']) ? 3 : 1;
        $bookingEngine->active = 1;
        $bookingEngine->save();        
        return $parsedData;         
    }
    
    private function _translateBookDetail($oriResults)
    {
        $results = [];
        foreach($oriResults as $item){
              $item['tripkey'] =  md5($item['transferType']. json_encode($item['vehicle']));
               $results[] = $item;
        }
        $departureList =  array_filter($results, function($item){
            return strtolower($item['transferDetails'][0]['direction'])   ==='departure';
        });
        $arrivalList =  array_filter($results, function($item){
            return strtolower($item['transferDetails'][0]['direction']) === 'arrival';
        });
       $roundTripList = $this->_parseTransferInfo($arrivalList,$departureList) ;
        return $roundTripList;              
    }
    
    private function  _parseTransferDesc($item){
         $pickupDesc= $item['pickupInformation']['pickup']['description'];
         $pickupLocation = $item['pickupInformation']['pickup']['stopName'];
         $transferDetailInfo = $item['content']['transferDetailInfo'];
         $generalnfo = $guideline =  [];
        foreach($transferDetailInfo as $info){
            switch($info['type']){
               case 'GENERAL_INFO':
                   $generalnfo[] =  $info['name'];
                   break;
               case 'GENERIC_GUIDELINES':
                   $guideline[] = ['title'=>$info['name'], 'desc'=>$info['description'] ];
            }
        }
        $generalDesc =  implode(";", $generalnfo);
        return array(
          'pickupDesc'=>$pickupDesc,
          'pickupLocation'=>$pickupLocation,
          'pickupTime'=>$item['pickupInformation']['formatTime'],  
          'generalDesc'=>$generalDesc,
           'guideline'=>$guideline, 
        );
    }
    
    
   
}
