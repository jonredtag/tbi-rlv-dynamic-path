<?php
namespace App\Services\Activity;
use App\Models\BookingHistory;
use App\Models\ActivityBooking;
use App\Models\EmailData;
use App\Models\ActivityDestinations;
use Illuminate\Support\Facades\Cache;

class ActivityService
{
    protected $activityRepo;
   
    public function __construct($activityRepo)
    {
        $this->activityRepo = $activityRepo;
        $rateInfo = config('app.currency_rate');
        $this->exchangeRate = json_decode($rateInfo, TRUE);
        /*array(
            'USD' => 0.7438,
            'CAD' => 1,
            'EUR' => 0.64447,
            'GBP' => 0.58469,
            'CHF' => 0.69388,
         );*/
    }

    public function search($params)
    {
        $sid = $params['sid'];
        $numRecords =  $params['numRecords']??10;
        $searchParameters = app('packageService')->getParameters($sid);
        $pax = null;
        /*
        if(isset($searchParameters['occupancy'])){
            $pax = ['adults' => 0, 'children' => 0, 'infants' => 0];
            $ages = [];
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
        }
         * 
         */
        $searchParam = $this->formatSearchParam($searchParameters, $pax);
        $searchRet = $data = $this->activityRepo->search($searchParam);
        if(!isset($searchRet['error'])){
            $translated = $data =  $this->translateSearch($searchRet); 
            app('packageService')->addSession($sid,['sessionId'=>$data['sessionId'],'searchParam'=>$searchParam], 'activity');
            \Cache::put("activity-results-".$data['sessionId'], $data, 1800);
            $data['list'] =  array_splice($data['list'],0,$numRecords); 
        } 
        return  $data;
    }
    public function autosuggest($term = ''){
        if ($term === '') {
            return [];
        }
        $data = ActivityDestinations::whereLike('name', $term)
                ->orWhereLike('name_fr', $term)
                ->orWhereLike('dest_code', $term)
                ->get();
        $response = [];
        $index = 0;

        foreach ($data as $city) {
            $item = $city->toArray();
            $row = [
                "category" => 'city',
                "index" => $index++,
                "code" => $item['dest_code'],
                "text" => utf8_encode($item['name']).', '.$item['country_code'],
                "text_fr" => utf8_encode($item['name_fr']),
                "value" => $item['dest_code'],
            ];
            $response[] = $row;
        }
        return $response;
    }
    
    private  function _featureFilter($params, $segmentFilters){
         $filterFeatures = ['category','duration','recommended','theme'];
         foreach($filterFeatures as $feature){
            if (!empty($params[$feature])) {
                       $amValid = false;
                       foreach ($params[$feature] as $catValue) {
                           if(in_array($catValue, $segmentFilters)){
                                  $amValid =  true;
                                  break;
                           } 
                       }
                       if(!$amValid){
                           return false;
                       }
             }     
         }
         return true;      
    }
    
    public function filterProduct($params=[], $sid=null)
    {
        $count = 0;
        $sessionData = app('packageService')->getSession($sid, 'activity');
                    
        if (!empty($sessionData)) {
            $sessionData['filterParams'] = $params;
            $cacheData =  \Cache::get("activity-results-".$sessionData['sessionId']);
            $results = $cacheData['list'];    
            $activities = [];
            if (is_null($results) || !count($results)) {
                return 0;
            }
            foreach ($results as $index => $activity) {
                $valid = $this->_featureFilter($params, $activity['segmentFilters']);
                if(!$valid){
                    continue;
                }
                if (!empty($params['name'])) {
                    if (!preg_match("/".preg_quote($params['name'])."/i", $activity['name'])) {
                        $valid = false;
                    }
                }
                if(!$valid){
                    continue;
                }
                if (!empty($params['price'])) {
                    if ($activity['price']['adultPrice'] < $params['price'][0] || $activity['price']['adultPrice'] > $params['price'][1]) {
                        $valid = false;
                    }
                }
                if ($valid) {
                    $activities[] = $index;
                }
            }

            if (!empty($params['sort'])) {
                usort($activitys, function($aIndex, $bIndex) use ($params, $results) {
                    $response = 0;
                    $a = $results[$aIndex];
                    $b = $results[$bIndex];
                    if ($params['sort'] === 'di') {
                        if ($a['distanceFrom'] < $b['distanceFrom']) {
                            $response = -1;
                        } elseif ($a['distanceFrom'] > $b['distanceFrom']) {
                            $response = 1;
                        }
                    } elseif ($params['sort'] === 'p_lh') {
                        if ($a['rate'] < $b['rate']) {
                            $response = -1;
                        } elseif ($a['rate'] > $b['rate']) {
                            $response = 1;
                        }
                    } elseif ($params['sort'] === 'p_hl') {
                        if ($a['rate'] < $b['rate']) {
                            $response = 1;
                        } elseif ($a['rate'] > $b['rate']) {
                            $response = -1;
                        }
                    }  elseif ($params['sort'] === 'n_az') {
                        if (strtolower($a['name']) < strtolower($b['name'])) {
                            $response = -1;
                        } elseif (strtolower($a['name']) > strtolower($b['name'])) {
                            $response = 1;
                        }
                    } elseif ($params['sort'] === 'n_za') {
                        if (strtolower($a['name']) < strtolower($b['name'])) {
                            $response = 1;
                        } elseif (strtolower($a['name']) > strtolower($b['name'])) {
                            $response = -1;
                        }
                    }
                    return $response;
                });
            }
            $count = count($activities);
            app('packageService')->addSession($sid,$sessionData, 'activity');
            \Cache::put("activity-filter-results-index-".$sessionData['sessionId'], $activities, 1800);
        } 
        return $count;         
    }
    
    public function book($params, $bookingID){
        $sid = $params['sid'];
        $activitysessionData = app('packageService')->getSession($sid, 'activity');
        $activityBookData  = $activitysessionData['selectedInfo']??null;
        if(!empty($activityBookData)){
            $activityBookData['searchParam'] =   $activitysessionData['searchParam'];
            $activityBookData['additionalAnswers'] =   $params['activityAnswers'];
        }
        $bookParams = array(
             'lang'=>$params['lang'],
             'paxs'=>$params['paxs'],  
             'activity'=>$activityBookData,
             'packageBookingId'=>$bookingID,
         );
         list($reqData, $response) = $this->activityRepo->book($bookParams);   
         $history = new BookingHistory;
         $history->booking_id = $bookingID;
         $history->action = 'activity';
         $history->request =   json_encode($reqData);
         $history->response = json_encode($response);
         $history->save(); 
        return $response;
    }
    
    public function formatSearchParam($searchData,$pax=null){
        $depTimeObj =  new \DateTime($searchData['flight']['depDestTime']??$searchData['retDate']);
        $arrTimeObj =  new \DateTime($searchData['flight']['arrDestTime']??$searchData['depDate']);
        if(isset($searchData['flight'])){
            $oneDayInterval = new \DateInterval("P1D");
            $arrTimeObj->add($oneDayInterval);
            $depTimeObj->sub($oneDayInterval);       
        }
        $fromDate =  $arrTimeObj->format("Y-m-d");
        $toDate =  $depTimeObj->format("Y-m-d");
        
        $searchParam =  array(
            'airportCode' => $searchData['flight']['destAirport']??$searchData['destination']['value'],
            'hotelGeo' => $searchData['hotel']['location']??null,
            'hotelName'=> $searchData['hotel']['hotelName']??null,
            'hotebedDestCode' => $searchData['hotelBedDestCode']??null,
            'from' =>  $fromDate,
            'to' =>  $toDate,
            'pax'=>$pax,
        );
        return $searchParam;
    }
    
   public function paginate($param){
        $data = ['totalResults'=>0,'list'=>[]];
        $sid = $param['sid'];
        $page =  $param['page']??0;
        $numRecords = $param['numRecords']??10;
        $start = $page * $numRecords; 
        $sessionData =  app('packageService')->getSession($sid,'activity');
        if($sessionData){
            $cacheData =  \Cache::get("activity-results-".$sessionData['sessionId']);
            if($cacheData && isset($cacheData['list'])){
                if(!empty($sessionData['filterParams'])){
                    $filterIndexData =  \Cache::get("activity-filter-results-index-".$sessionData['sessionId']);
                } else {
                    $filterIndexData =  array_keys($cacheData['list']);
                } 
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
    
     public function getDetails($params){
        $sid =  $params['sid'];
        $id =  $params['id'];
        $sessionData =  app('packageService')->getSession($sid,'activity');
        if($sessionData){
             $resultSessionId = $sessionData['sessionId'];
             $detailData =  \Cache::get("activity-detail-".$resultSessionId.'-'.$id);        
            if($detailData){
                $data = $detailData;
            } else {
                $resultsData =  \Cache::get("activity-results-".$resultSessionId);
                if($resultsData){
                        $list = $resultsData['list'];
                        $item = null;
                        $findItem =  array_filter($list, function($l) use($id) { return ($l['code'] == $id);});
                        if($findItem){
                            $item =  array_pop($findItem);
                        }
                        if(!empty($item)){
                            $request = $sessionData['searchParam']; //this is for direct source call
                            $request['code'] = $item['code']; //this is for direct source call 
                            $request['sessionId'] = $resultsData['sessionId'];
                            $request['resultsId'] =  $resultsData['resultsId'];
                            $request['rowId'] =  $item['rowId'];
                            $detailRet =  $this->activityRepo->getDetails($request);
                            $data = $this->_translateDetails($id,$detailRet,$params['media']??false);
                            \Cache::put("activity-detail-".$resultSessionId.'-'.$id, $data, 1800);
                        } else {
                             $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
                        }
                } else {
                     $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
                }
           }
           if(!isset($data['error'])){
                $list = $this->_findSearchListById($resultSessionId, $id); 
                if($list){
                    $included =  $list['included']??[];
                    $includedData = [];
                    if(!empty($included)){
                        $includedParsed = [] ;
                        foreach($included as $inc){
                            $includedParsed[$inc['name']][] = $inc['included'][0];
                        }
                        foreach($includedParsed as $name=>$arr){
                            $includedData[] =  array('name'=>$name,'included'=>$arr);
                        }
                    }
                    $data['description'] = $list['description']??'';
                    $data['destination'] = $list['destination']??[];
                    $data['gallery'] =  $list['gallery']??[];
                    $data['summary'] = $list['summary']??null;
                    $data['location'] = $list['location']??null;
                    $data['duration'] = $list['duration']??[];
                    $data['categories'] = $list['categories']??[];
                    $data['scheduling'] = $list['scheduling']??[];
                    $data['guideOptions'] = $list['guideOptions']??null;
                    $data['redeemInfo'] = $list['redeemInfo']??[];
                    $data['requirement'] = $list['requirement']??[];
                    $data['included'] =  $includedData;
                    $data['excluded'] = $list['excluded']??[];
                    $data['highligths'] = $list['highligths']??[];  
                    $data['tourLang'] = $list['tourLang']??null;
                }   
            }
        } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
       }
       return $data;   
    }
    
    private  function _findSearchListById($resultSessionId, $id){
        $resultsData =  \Cache::get("activity-results-".$resultSessionId);
        $list = [];
        if($resultsData){
            $findItem =  array_filter($resultsData['list'], function($l) use($id) { return ($l['code'] == $id);});
            if($findItem){
                $list =  array_pop($findItem);
            }    
        }        
        return $list;
    }


    public function add($params){ //activity id : 1-1,
        $sid =  $params['sid'];
        $selectedId =  $params['id'];
        $answers =  $params['answers']??null;
        $idSplit =  explode("|", $selectedId);
        $idPrefixSplit =  explode("_", $idSplit[0]);
        $id =  $idPrefixSplit[0];        
        $sessionData = app('packageService')->getSession($sid, 'activity');
        $standalone = isset($params['isStandalone']) && $params['isStandalone']?true:false;  
        if($sessionData){
            $detailData =  \Cache::get("activity-detail-".$sessionData['sessionId'].'-'.$id);
            if($detailData){
                 if($standalone){
                    app('packageService')->updatePaxsParameter($sid, $params['paxs']);
                    $totalfare = 0;
                    $results = [];
                } else {
                    $results = $sessionData['selectedInfo']['results']??[];
                    $totalfare = $sessionData['selectedInfo']['fare']??0; 
                }
                $translated =  $this->_translateSelected($detailData, $selectedId,$params['paxCount']??null, $answers);      
                $totalfare += $translated['fare']; 
                $results[$selectedId] = $translated['results'];
                $list = $this->_findSearchListById($sessionData['sessionId'], $id);
                if(!empty($list)){ 
                    $results[$selectedId]['thumbImg']  =  $list['thumbImg'];
                    $results[$selectedId]['destination'] = $list['destination'];
                }
                $data = array(
                    'fare'=>$totalfare,
                    'results'=>$results,
                ) ;
                $sessionData['selectedInfo'] =  $data; 
                app('packageService')->addSession($sid,$sessionData, 'activity');
           } else {
                $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
           }      
        } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
        }
       return $data;        
    }
    
    public function remove($params){
        $sid =  $params['sid'];
        $id =  $params['id'];
        $sessionData = app('packageService')->getSession($sid, 'activity');
        if($sessionData){
            $results = $sessionData['selectedInfo']['results']??[];
            if(!empty($results)){
                 $totalAmount  =  $sessionData['selectedInfo']['fare'];
                 $totalAmount -= $results[$id]['price']['totalAmount'];
                unset($results[$id]);
                $data= array('fare' =>$totalAmount,'results' =>$results);     
                $sessionData['selectedInfo'] = $data;
                app('packageService')->addSession($sid,$sessionData, 'activity');
            } else {
                $data =  ['error'=>['code'=>'S-404','message'=>'It seems you had no that item at all']];
            }
       } else {
            $data = ['error'=>['code'=>'S-01','message'=>'Your booking session has expired would you like to restart?']];
       }
       return $data;
    }
    
    private function _parseSegement($segmentGroups){
        $filterValue = [];
        foreach($segmentGroups as $item){
            foreach($item['segments'] as $segment){
                $filterValue[] = $segment['code'];
            }
        }
        return $filterValue;
    }

     private function _parseFeatures($segmentGroups, $code){
         $group =  array_filter($segmentGroups, function($item) use ($code) {
                                                                                return strtolower($item['code'])==$code;
                                                                    });
        $features = [];      
        if(!empty($group)){
            foreach($group as $seg){
                foreach($seg['segments'] as $item){
                    $features[] = $item['name'];
                }    
            } 
        } 
        return $features;
    }
    
    public function translateSearch($detail)
    {   
        $sessionId = $detail['data']['session']['id']??time();
         if(!(isset($detail['data']['activitiesResults']['rows']) || isset($detail['activities'])) ){
            return ['sessionId'=>$sessionId,'totalResults'=>0, 'list'=> []];
        }
        $results =  $detail['data']['activitiesResults']['rows']??$detail['activities'];
        $activityList = [];
        foreach($results as $index=>$item){
            /*
            if($item['code'] ==="E-MX1-CUN2PARKS"){
                $test = '1';
            }
            * 
            */
             $currencyId =  $item['currency'];
             $adultInfoSearch = array_filter($item['amountsFrom'], function($amtItem){
                                                                                return strtolower($amtItem['paxType'])=='adult';
                                                                            });
             $adultPriceInfo = array_values($adultInfoSearch);                                                               
             $adultPrice = $adultPriceInfo[0]['amount'];
             $cheapRate = 0;
             $gatePrice = 0;
             if(isset($adultPriceInfo[0]['boxOfficeAmount'])){
                 $gatePrice = $adultPriceInfo[0]['boxOfficeAmount'];
                 if($gatePrice > $adultPrice){
                     $cheapRate = ($gatePrice-$adultPrice)/$gatePrice;
                 }
             }
             $thumbnailData = isset($item['content']['media']['images'][0]['urls'])? array_filter($item['content']['media']['images'][0]['urls'], 
                                                                            function($img){
                                                                                return strtolower($img['sizeType'])=='large';
                                                                            }):[]; 
             $thumbnail =  array_pop($thumbnailData);   
             
             $images = [];
             if(isset($item['content']['media']['images'])){
                 foreach($item['content']['media']['images'] as $image){
                      $pickedImg =  array_filter($image['urls'], function($img){
                                                                                return strtolower($img['sizeType'])=='xlarge';
                                                                            });
                      $tmp = array_pop($pickedImg);
                      $images[] =  ['image'=>$tmp['resource']];
                 }
             }
             
             $included = [];
             $excluded=[];
             if(isset($item['content']['featureGroups'])){
                 foreach($item['content']['featureGroups'] as $feature){
                     if(isset($feature['included'])){
                         $featureIncluded=  array('name'=> $feature['groupCode'] !='UNKNOWN'? ucfirst(strtolower($feature['groupCode'])):'Others');
                         $featureItems= [];
                        foreach($feature['included'] as $inc ){
                            $featureItems[] = $inc['description'];
                        }
                        $featureIncluded['included'] = $featureItems;  
                        $included[] = $featureIncluded; 
                    } else if(isset($feature['excluded'])){
                         $featureExcluded=  array('name'=> $feature['groupCode']=='ASSISTANCE'?'Fares and fees':'Others');
                         $featureExItems= [];
                        foreach($feature['excluded'] as $inc ){
                            $featureExItems[] = $inc['description'];
                        }
                        $featureExcluded['excluded'] = $featureExItems;  
                        $excluded[] = $featureExcluded; 
                    }                     
                 }
             }
              $redeemInfo= null;                                                                   
              if(isset($item['content']['redeemInfo']['comments'])){
                  foreach($item['content']['redeemInfo']['comments'] as $comment){
                       if(isset($comment['description'])){
                            $redeemInfo[] = $comment['description'];
                       }
                  }
              } 
              
             $location =  $item['content']['location'];
             $addr = '';
             if($location && $location['startingPoints'][0]['meetingPoint']){
                $startPoint =  $location['startingPoints'][0]['meetingPoint'];
                $addr = !empty($startPoint['address'])? $startPoint['address']:'';
                if(!empty($startPoint['zip'])){
                    $addr .= $startPoint['zip'];
                }
                if(!empty($startPoint['country']['destinations'])){
                    $addr .= (empty($addr)?"":','). $startPoint['country']['destinations'][0]['name'];
                } else  if(!empty($startPoint['city'])){
                   $addr .= (empty($addr)?"":','). $startPoint['city'];
                }
                if(!empty($startPoint['country'])){
                   $addr .= (empty($addr)?"":',').$startPoint['country']['name'];
                }
             }
            
             $tourLang = [];
             if(isset($item['content']['guidingOptions'])){
                $guidingOptions = $item['content']['guidingOptions'];
                if($guidingOptions['guideType'] =='TOURGUIDE'
                     && $guidingOptions['included']){
                        foreach($item['modalities'] as $mdl){
                            if(!empty($mdl['language'])){
                                $tourLang[] = ucfirst(str_replace('Tour ', '', $mdl['name']));
                            }
                        }
                 }
            } 
             
             $activityList[] = array(
               'description'=>$item['content']['description']??'',
               'summary'=> !empty($item['content']['summary'])?strip_tags($item['content']['summary']) :null,  
               'code'=>$item['code'],   //this is for direct source call 
               'price'=>array(
                      'gatePrice'=>$gatePrice/$this->exchangeRate[$currencyId],
                      'cheapRate'=>$cheapRate,
                      'adultPrice'=>$adultPrice/$this->exchangeRate[$currencyId],
                      'currencyId'=>$currencyId,
                    ),  
               'rowId'=>$item['positionIndex']??$index,  
               'type'=>$item['type'],  
               'name'=>$item['name'],
               'segmentFilters'=>$this->_parseSegement($item['content']['segmentationGroups']??[]),
               'duration'=>$this->_parseFeatures($item['content']['segmentationGroups']??[], 3),
               'categories'=>$this->_parseFeatures($item['content']['segmentationGroups']??[], 1),
               'thumbImg'=> !empty($thumbnail)?$thumbnail['resource']:null, 
               'gallery'=>$images,  
               'destination'=>isset($item['country'])? $item['country']['destinations'][0]['name'].(isset($item['country']['name'])? ",".$item['country']['name']:''):'',
               'redeemInfo'=>$redeemInfo,
               'numOfOptAva'=>count($item['modalities']),  
               'scheduling'=>$item['content']['scheduling']??null, 
               'guideOptions'=>$item['content']['guidingOptions']??null, 
               'requirement'=>$item['content']['importantInfo']??null, 
               'included'=>$included, 
               'excluded'=>$excluded,  
               'highligths'=>$item['content']['highligths']??[], 
                'tourLang'=>$tourLang, 
               'location'=>isset($location)?[
                    'addr'=>$addr, 
                    'start' => $location['startingPoints'][0]['meetingPoint']['description']??null,
                    'pickUpInfo' => $location['startingPoints'][0]['pickupInstructions'][0]['description']??null,
                    'end' => $location['endPoints'][0]['description']??null, 
                   ]:null,
             );
        }
       return ['sessionId'=>$sessionId,  'resultsId'=>$detail['data']['activitiesResults']['resultsId']??'', 'totalResults'=>count($activityList), 'list'=>$activityList];      
    }
    
   public function getSelectedProducts($sid){
        $prodInfo = app('packageService')->getSession($sid, 'activity');
        if(isset($prodInfo['selectedInfo'])){
            $data =  $prodInfo['selectedInfo'];
        }
       //check the questions
        $questFilters = ['FLIGHTNUMBER','FLIGHTTIME','FLIGHTAIRPORT',
            'PAX_NAME','EMAIL','PHONENUMBER'];
        foreach($data['results'] as $key=>$item){
            if(isset($item['questions'])){
                $questions = [];
                foreach($item['questions'] as $ques){
                     if(in_array($ques['code'],$questFilters)){
                         continue;
                     }
                     $questions[] = $ques;
                }
                if(count($questions)){
                    $data['results'][$key]['questions'] = $questions;
                } else {
                    unset($data['results'][$key]['questions']);
                }
            }
        }
        return $data;
    }
    
     public function logBooking($bookRd, $sid, $paxs,$bookingID)
    {
        $mainPax = $paxs[0];
        $holder =  array(
             'title'=>$mainPax['title']??'',
             'name'=>$mainPax['first'].(!empty($mainPax['middle'])?' '.$mainPax['middle']:''),
             'surname'=>$mainPax['last'],
             'email'=>$mainPax['email'],
             'phone'=> str_replace("-", "", $mainPax['phone']),
         ); 
         $sessionData = app('packageService')->getSession($sid, 'activity');
        if(isset($bookRd['booking'])){
            $bookingInfo =  $bookRd['booking'];
            $total = $bookingInfo['total'];
            $currencyId = $bookingInfo['currency'];
            $totalAmount = number_format($total/$this->exchangeRate[$currencyId],2,'.','');
            $bookingNumber = $bookingInfo['status']=='CONFIRMED' ? $bookingInfo['reference']:"PENDING";
            $bookDate =  new \DateTime($bookingInfo['creationDate']);
            $parsedActivity = $this->_translateBookDetail($bookingInfo['activities'], $currencyId, $paxs);                      
        } else {
             $bookingNumber = "PENDING";
             $supplier=null;
             $bookDate =  new \DateTime();
             $sessionData = app('packageService')->getSession($sid, 'activity');
             $totalAmount = $sessionData['selectedInfo']['fare'];
             $parsedActivity =  array_values($sessionData['selectedInfo']['results']);
             foreach($parsedActivity as $i=> $item){
                 $operationDates =  $item['operationDates'];
                 unset($item['operationDates']);
                 $item['paxsPaidDetail'] = $this->_translatePaxsPaidDetail($paxs, $item['paxAmounts']);
                 $item['cancellationPolicies'] =   isset($item['selectDate']['cancellationPolicies'])?
                                $item['selectDate']['cancellationPolicies']:null;
                 $parsedActivity[$i] = $item;
             }
        }
        $parsedData =  [
               'totalAmount'=> $totalAmount,
               "bookingNumber" => $bookingNumber ,
               "bookDate"=> $bookDate->format("Y-m-d H:i:s"),
               "tripInfo"=>$parsedActivity,
                'holder'=>$holder,
        ]; 
        $bookingEngine = new ActivityBooking; 
        $bookingEngine->booking_number = $parsedData['bookingNumber']??'';
        $bookingEngine->booking_id = $bookingID;
        $bookingEngine->booking_data = json_encode($parsedData);
        $bookingEngine->booking_status = isset($parsedData['bookingInfo']) ? 3 : 1;
        $bookingEngine->active = 1;
        $bookingEngine->save();        
        return $parsedData;         
    }
    
    private function _translateSelected($list, $seletedId,$paxCount = null, $answers=null){
        $totalAmount = 0;
        $item = [];
        if(!empty($list)){
            $idSplit =  explode("|", $seletedId);
            $idPrefixSplit =  explode("_", $idSplit[0]);
            $listOptions =  $list['options'];
            foreach($listOptions as $option){
                if($option['key'] == $idSplit[0]){
                    $item =  $option;
                    $item['selectId'] = $seletedId;
                    break;
                }
            }
            if(!empty($item)){
                $item['selectDate'] = $item['operationDates'][$idSplit[1]];
                if(empty($item['answers']) && !empty($answers)){
                    $answerFilled = [];
                    foreach($item['questions'] as $question){
                        $key = $question['key'];
                        $code = $question['code'];
                        $answerFilled[] =  array(
                          "question"=>['code'=>$code],
                          "answer"=>$answers[$key]  
                        );
                    }
                    $item['answers'] =  $answerFilled;
                }
                if(!empty($paxCount)){
                    $item['paxCount'] = $paxCount;
                    foreach($paxCount as $paxIdx=>$count){
                        $totalAmount += floatval($item['paxAmounts'][$paxIdx]['amount'])*$count;
                    }
                } else {
                     $totalAmount = $item['price']['totalAmount'];
                }
            }
        }
        // may add translation for the $selectItems;
        return ['results'=>$item,'fare'=>$totalAmount];
    }
    
    
    private function _parseQuestions($mdlKey,$questions){
        $parsed = [];
        $mdlKey = str_replace(['-','_'],'',$mdlKey);
        foreach($questions as $i=>$q){
            if($q['required']){
                $q['key'] = $mdlKey.'_'.$i;
                $parsed[] = $q; 
            }
        }
        return $parsed;
    } 
    private function _translateDetails($id,$resultsRet, $media=false) {
        $returnItems = [];
        $details = $resultsRet['data']['activitiesDetails']??($resultsRet['activity']??null);
        if(isset($details)){
            $name =  $details['name'];
            $currencyId =  $details['currency'];
            if(isset($details['modalities'])){
                foreach($details['modalities'] as $mdIdx=>$mdl){
                    $rateDateOptions = [];
                    if(isset($mdl['rates'])){
                        foreach($mdl['rates'] as $rate){
                            if(isset($rate['rateDetails'])) {
                                foreach($rate['rateDetails'] as $deIdx=>$rateDetails){
                                    $key = $id.'_'.$mdIdx.'_'.$deIdx;
                                    $session = $rateDetails['sessions'][0]['name']??null;
                                    foreach($rateDetails['operationDates'] as $dtOptIdx=> $optDate){
                                        $optDate['text'] =  $optDate['from'];
                                        $optDate['value'] =  $key.'|'.$dtOptIdx;
                                        $cancelFees = [];
                                        if(isset($optDate['cancellationPolicies'])){
                                            foreach($optDate['cancellationPolicies'] as $pl){
                                                $pl['amount'] = number_format($pl['amount']/$this->exchangeRate[$currencyId],2,'.','');
                                                $cancelFees[] =  $pl;
                                            }
                                        }
                                        $optDate['cancellationPolicies'] = $cancelFees;  
                                        $rateDateOptions[$dtOptIdx] = $optDate;
                                    }
                                    $duration = $rateDetails['minimumDuration']['value'];
                                    if($rateDetails['maximumDuration']['value']>$duration){
                                        $duration .='-'.$rateDetails['maximumDuration']['value'];
                                    }
                                    $duration.=$rateDetails['minimumDuration']['metric'];
                                    $paxAmounts = [];
                                    foreach($rateDetails['paxAmounts'] as $pax){
                                        $pax['paxType'] = $paxType = strtolower($pax['paxType']);
                                        $pax['age'] =  $paxType==='adult'? '19':$pax['ageFrom'].'-'.$pax['ageTo'];
                                        $pax['amount'] = number_format($pax['amount']/$this->exchangeRate[$currencyId],2,'.','');
                                        $pax['currencyId'] = $currencyId;
                                        if($paxType==='adult'){
                                            $adultPax = $pax;
                                        } else {
                                            $paxAmounts[] =  $pax;
                                        }
                                    }
                                    array_unshift($paxAmounts, $adultPax); //make sure adult is first one 
                                    $promoDesc = null;
                                    if(isset($mdl['promotions'])){
                                        $promoDesc = $mdl['promotions'][0]['name']; 
                                    }
                                   $tourLang = []; 
                                   if(isset($rateDetails['languages'])){
                                       foreach($rateDetails['languages'] as $lang){
                                           $tourLang[] =  $lang['description'];
                                       }
                                   }
                                   
                                    $cheapRate = 0;
                                    if(isset($rateDetails['totalAmount']['boxOfficeAmount'])){
                                        $gatePrice =$rateDetails['totalAmount']['boxOfficeAmount'];
                                        $oriPrice = $rateDetails['totalAmount']['amount'];
                                        if($gatePrice > $oriPrice){
                                            $cheapRate = ($gatePrice-$oriPrice)/$gatePrice;
                                        }
                                    }
                                   
                                    $returnItems[] = array(
                                        'key'=>$key,
                                        'tourLang'=>!empty($tourLang)?$tourLang[0]:null,
                                        'title'=>$mdl['name'].(!empty($promoDesc)?'-'.$promoDesc:'') .(!empty($session)?'-'.$session:''),
                                        'name'=>$name.'-'.$mdl['name'],
                                        'comments'=>$mdl['comments'][0]??null,
                                        'promotions'=>$mdl['promotions'][0]??null,
                                        'supplier'=>$mdl['supplierInformation']['name'],
                                        'duration'=>$duration,
                                        'questions'=> !empty($mdl['questions'])?$this->_parseQuestions($key,$mdl['questions']):[],
                                        'rateKeys'=>$rateDetails['rateKey'],
                                        'rateClass'=>$rate['rateClass'],
                                        'paxAmounts'=>$paxAmounts,
                                        'operationDates'=>$rateDateOptions,
                                        'price'=>[
                                                'totalAmount'=>number_format($rateDetails['totalAmount']['amount']/$this->exchangeRate[$currencyId],2,'.',''),
                                                'cheapRate'=>$cheapRate,
                                                'currencyId'=>$currencyId,
                                            ]
                                       
                                    ) ;
                                }
                            }    
                        }
                    }
                    
                }
            }
            $filterDateResults=[];
            foreach($returnItems as $item){
                foreach($item['operationDates'] as $dateInfo){
                    $filterDateResults[$dateInfo['text']][] = $item['key'];
                }
            }
            ksort($filterDateResults, SORT_STRING);
            $dateFilters = [];
            foreach($filterDateResults as $date=>$filterResult){
                $dateFilters[] = ['key'=>$date, 'data'=>$filterResult];
            }
            $data  = [  'sessionId'=>$resultsRet['data']['session']['id']??'', 
                            'options'=>$returnItems,
                            'dateFilters'=>$dateFilters,
                            'name'=>$name,
                        ];
            
            //add more translation for detail
            return $data; 
        }        
    }   
      private function _translatePaxsPaidDetail($paxs, $paxAmounts, $currencyId=null){
           foreach($paxs as $j=> $pax){
                $paxs[$j]['amount'] = 0;
           } 
           foreach($paxAmounts as $paxA){
                $currencyId = isset($paxA['currencyId'])?$paxA['currencyId']:$currencyId ;
                 if(strtolower($paxA['paxType']) =='adult'){
                      foreach($paxs as $i=> $pax){
                          if($pax['type'] =='adult'){
                               $paxs[$i]['amount'] =  number_format($paxA['amount']/$this->exchangeRate[$currencyId],2,'.','');
                          }
                      }
                 } else {
                      $minAge = $paxA['ageFrom'];
                      $maxAge =  $paxA['ageTo'];
                      $ageIndx =  $minAge.'-'.$maxAge;
                      foreach($paxs as $i=> $pax){
                          if($pax['type']=='child' && $pax['age'] == $ageIndx){
                              $paxs[$i]['amount'] =  number_format($paxA['amount']/$this->exchangeRate[$currencyId],2,'.','');
                          }
                      }
                 }
           }
           return $paxs;
      }
      
      private function _pickVoucher($vouchers, $lang='eng'){
          if(count($vouchers)){
              foreach($vouchers as $v){
                  if(strtolower($v['language']) =='eng' &&  strpos(strtolower($v['mimeType']), 'pdf') !== false){
                      return $v['url'];
                  }
              }
          }
      }
      
      private function _translateBookDetail($activities, $currencyId, $paxs) {
            $returnItems = [];    
            //Need check the addon mutilple activities
            
            foreach($activities as $details){
                   $paxAmounts =  $details['amountDetail']['paxAmounts'];
                   $name =  $details['name'];
                   $cancellationPolicies = !empty($details['cancellationPolicies'])?$details['cancellationPolicies']:null;
                   if(!empty($cancellationPolicies)){
                       foreach($cancellationPolicies as $i=>$pl){
                          $cancellationPolicies[$i]['amount'] =  number_format($pl['amount']/$this->exchangeRate[$currencyId],2,'.','');
                       }
                   }
                   $returnItems[] = array(
                        'name'=>$name.'-'.$details['modality']['name'],
                        'supplier'=>$details['supplier']['name'],
                        'paxsPaidDetail'=>$this->_translatePaxsPaidDetail($paxs, $paxAmounts, $currencyId),
                        'paxAmounts'=>$paxAmounts,
                        'selectDate'=>['from'=>$details['dateFrom'],'to'=>$details['dateTo']],
                        'vouchers'=>isset($details['vouchers']) && count($details['vouchers'])?$this->_pickVoucher($details['vouchers']):null,
                        'price'=>[
                                'totalAmount'=>number_format($details['amountDetail']['totalAmount']['amount']/$this->exchangeRate[$currencyId],2,'.',''),
                            ],
                       'comments'=>!empty($details['comments'])?$details['comments'][0]:null,
                       'cancellationPolicies'=>$cancellationPolicies,
                    ) ;
            }
            return $returnItems;
              
    }  
    
    public function getBookingData($bookingId = null, $emailCode = null)
    {
        //add secuity here to check both bookingID and $emailCode
        $emailQuery = EmailData::where('booking_id', $bookingId);
        if($emailCode !== null) {
            $emailQuery->where('code', $emailCode);
        }
        $emailRecord = $emailQuery->get()
            ->first();
        if (is_null($emailRecord)) {
            abort(403);
        }
        
        $activityRecord = BookingHistory::where('booking_id', $bookingId)
                ->get()
                ->first();
        if (is_null($activityRecord)) {
            abort(403);
        }
        \App::setLocale($emailRecord->locale);
        return $activityRecord->response;
    }
    
   
    
    

     
        
    
   
}
