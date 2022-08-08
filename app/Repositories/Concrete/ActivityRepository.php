<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Promise;
use App\Helper\Helpers;
use App\Models\HotelMapping;

class ActivityRepository{
    protected $_apiClient;

    function __construct() {
        $this->baseActivityApiUrl = config('api.activity');
        // $this->apiKey =  env("ACTIVITY_API_KEY","5417db49e0afb4cecaafa612dea18b8e");
        // $this->apiSec =  env("ACTIVITY_API_SEC","8bde25a5e2");
        $this->apiKey =  env("ACTIVITY_API_KEY","da60c840c8ced101802166b6f9a24a0a");
        $this->apiSec =  env("ACTIVITY_API_SEC","296d9ae3ae");
        $this->ip = Helpers::getClientIp();
        $this->_apiClient = new Guzzle(array('verify'=> false));
    }
    
    public function search($activitiSearch){
        $req = array(
                    "filters"=> [ array(
                                        "searchFilterItems"=>[ 
                                                                    array("type"=>"destination", "value"=>$activitiSearch['airportCode'])
                                                                ]
                                            )
                                    ],
                    "from"=> $activitiSearch['from'],
                    "to"=> $activitiSearch['to'],
                    "paxes"=>[['age'=>30]]
                );
         
        $header= array(
                     'headers' => [
                         'Api-key' =>$this->apiKey,
                         'X-Signature' => hash("sha256", $this->apiKey .$this->apiSec . time()),
                         'Content-Type' => 'application/json',
                     ],
                     'body' => json_encode($req)
                 );
        $promise = $this->_apiClient->postAsync($this->baseActivityApiUrl.'activities/availability', $header);  
        $resp = Promise\settle($promise)->wait();
        try {
            if($resp[0]['state'] =='fulfilled'){
                $response = json_decode($resp[0]['value']->getBody(), true);
            } else {
                $response = [ "error" => [ "message" =>  $resp[0]['reason']->getMessage()]];
            }
        }catch (\Exception $e) {
            $response = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
        }
        if(env("APP_LOG",false)){ 
            file_put_contents("activity-search-log-".date('Y-m-d-h-i')."-req.json", json_encode($req,JSON_HEX_APOS));
            file_put_contents("activity-search-log-".date('Y-m-d-h-i')."-resp.json",  json_encode($response,JSON_HEX_APOS));   
        }
        return $response;        
    }
    
     public function getDetails($param)
    {   
        /*
        $query = [
                "session"=> [
                    "id"=> $param['sessionId']
                ],          
                "detailsRQ"=> [
                    "version"=>"v1",
                    "inputs"=> [
                        "resultsId"=>$param['resultsId'],
                        "rowId"=>$param['rowId'], 
                    ]
                ]
            ];
        
        $promise = $this->_apiClient->requestAsync('GET', $this->baseActivityApiUrl. "detail", [
                "query" => [
                    'q' => json_encode($query)
                ]
         ]);
        */
        if(isset($param['code'])){
            $agesArr = [];
            if(isset($param['pax'])){
                foreach($param['pax']['ages'] as $age){
                    $agesArr[] =  ['age'=>$age];
                }
            } else {
                $agesArr = array(['age'=>30]);
            }
             $query = array(
               "code"=> $param['code'],
               "from"=> $param['from'],
               "to"=> $param['to'],
               "language"=>'en',
               "paxes"=>$agesArr    
            );
             $header= [
                                'headers' => [
                                    'Api-key' =>$this->apiKey,
                                    'X-Signature' => hash("sha256",  $this->apiKey .$this->apiSec. time()),
                                    'Content-Type' => 'application/json',
                                ],
                                'body' => json_encode($query)
                            ];
             $promise = $this->_apiClient->postAsync($this->baseActivityApiUrl. 'activities/details', $header);  
        }
        $resp = Promise\settle($promise)->wait();
        try {
              $response = json_decode($resp[0]['value']->getBody(), true);
        } catch (\Exception $e) {
            $response = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
        }
        if(env("APP_LOG",false)){ 
            file_put_contents("activity-detail-log-".date('Y-m-d-h-i')."-POST-req.json", json_encode($query,JSON_HEX_APOS));
            file_put_contents("activity-detail-log-".date('Y-m-d-h-i')."-resp.json",  json_encode($response,JSON_HEX_APOS));   
         }
        return $response;
    }
    
   public function book($params)
    {
        $paxs =  $params['paxs'];
        $mainPax = $paxs[0];
        $holder =  array(
            'name'=>$mainPax['first'].(!empty($mainPax['middle'])?' '.$mainPax['middle']:''),
            'surname'=>$mainPax['last'],
            'email'=>$mainPax['email'],
            'telephones'=> [str_replace("-", "", $mainPax['phone'])],
        );
        $paxList =  [];
        foreach($paxs as $pax){
            if($pax['type']=='adult'){
                $age = 30; 
            } else {
                $age = Helpers::getAge($pax['year'].'-'.$pax['month'].'-'.$pax['day']);
            }
            /*
            $age =  $pax['type'] === 'adult'?30: $pax['age'] ;
            if(strpos($age,'-') !== false){
                $ageSplit =  explode('-', $age);
                $age =  rand(intval($ageSplit[0]),intval($ageSplit[1]));
            }
             * 
             */
            $paxList[] = array(
                'age'=>$age,
                'name'=>$pax['first'].(!empty($pax['middle'])?' '.$pax['middle']:''),
                'surname'=>$pax['last'],
                'type'=>$pax['type']=='adult'?"ADULT":'CHILD',
            );
        }
        $activityBookParam = $params['activity'];
        $activitySearchParam =  $activityBookParam['searchParam'];
        $additionalAnswers =  $activityBookParam['additionalAnswers'];
        $activityList = [];
        foreach($activityBookParam['results'] as $trip){
            $reqInfo = [
                             "serviceLanguage"=> $params['lang'],
                             "rateKey"=>$trip['rateKeys'],
                             "from"=>$trip['selectDate']['from'],
                             "to"=>$trip['selectDate']['to'],
                             "paxes"=>$paxList,
                        ];
            if(isset($trip['answers'])){
                   $reqInfo['answers'] = $trip['answers'];
            } elseif(isset($trip['questions'])){
                 $answers = [];
                 foreach($trip['questions'] as $ques){
                    $questionRet = null; 
                    $code = $ques['code'];
                    switch($code){
                       case 'FLIGHTNUMBER':
                       case 'FLIGHTTIME':
                       case 'FLIGHTAIRPORT':
                           $questionRet = $trip['selectDate']['from'];
                           break;

                       case 'EMAIL':
                           $questionRet = $mainPax['email'];
                           break;

                       case 'PAX_NAME':
                                $px =  $paxs[0];
                                $questionRet =    $px['first'].(!empty($px['middle'])?' '.$px['middle']:'').' '.$px['last'];
                          break;

                       case 'NC-CTEL':
                       case 'PHONENUMBER':   
                              $questionRet = $mainPax['phone'];
                            break;

                       default:
                           $questionRet =  $additionalAnswers[$trip['selectId']][$ques['key']]??null;
                           break;
                    }
                    if(!empty($questionRet)){
                        $answers[] =   array(
                            "question"=>['code'=>$code],
                            "answer"=>$questionRet  
                          );    
                    }
                 }
                 $reqInfo['answers'] =  $answers;
           }
          $activityList[] = $reqInfo;
       }
        $data = array(
            "language"=>"en",
            "clientReference"=>"package-".$params['packageBookingId'],
            "holder"=>$holder,
            "activities"=>$activityList,
        );
        $header= [
                    'headers' => [
                        'Api-key' => $this->apiKey,
                        'X-Signature' => hash("sha256",$this->apiKey .$this->apiSec. time()),
                        'Content-Type' => 'application/json',
                    ],
                    'body' => json_encode($data)
                ];
        $promise = $this->_apiClient->putAsync($this->baseActivityApiUrl.'bookings', $header);              
        $bookDevTest = env('BOOK_DEV_TEST',0);
        if(false){
       // if($bookDevTest){
                $testActivityData = '{"bookings":[{"reference":"102-10949901","bookingFileId":null,"creationDate":"2021-02-19T15:10:11","status":"CONFIRMED","modificationsPolicies":{"cancellation":true,"modification":true},"holder":{"name":"Prakash","surname":"Prajapati","email":"ppprajapati@netclues.com","phone":"+16543245812"},"transfers":[{"id":1,"rateKey":"DEPARTURE|ATLAS|21|ATLAS|57|2021-08-17|12:15|2021-08-17|12:15|1~0~0|4|229145|BCN MVEL BON21|229145|BCN MVEL BON21|102|PRVT|3|MVEL|PRM|59.33|BARCELONA|BARCELONA|12738|1419|BCN|SIMPLE|07c6e219cb978695d070784ac8a69c37","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"21","description":"Viladomat Barcelona","type":"ATLAS"},"to":{"code":"57","description":"Barcelona Universal","type":"ATLAS"},"date":"2021-08-17","time":"12:15:00","pickup":{"address":"Carrer De Viladomat,197  ","number":null,"town":"BARCELONA","zip":"08015","description":"You will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":41.382474,"longitude":2.153346,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":12738,"stopName":"RECEPTION BON VIATJE","image":null}},"paxes":[{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"DRVR","name":"CANT FIND DRIVER","description":"In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"RESTACCESS","name":"restricted access","description":"Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"},{"id":"PLEGACHAIR","name":"Foldable wheelchairs","description":"Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":15,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nYou will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 15 minutes\n\n* Maximum capacity per vehicle: 7 Suitcase\/s\n\n* In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.\n* Remember to bring a printed copy of this voucher and a valid photo ID with you.\n* Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.\n* Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.\n* Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":63.43,"netAmount":63.43,"currencyId":"EUR"},"cancellationPolicies":[{"amount":63.43,"from":"2021-08-16T00:00:00","currencyId":"EUR"}],"factsheetId":1419,"arrivalFlightNumber":null,"departureFlightNumber":null,"arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[],"sourceMarketEmergencyNumber":"+34871180153","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/102-10949901\/id\/1","method":"DELETE"}]},{"id":2,"rateKey":"DEPARTURE|ATLAS|57|ATLAS|21|2021-08-20|12:15|2021-08-20|12:15|1~0~0|4|229145|BCN MVEL BON21|229145|BCN MVEL BON21|102|PRVT|3|MVEL|PRM|59.33|BARCELONA|BARCELONA|12738|1419|BCN|SIMPLE|ca87384d8d9d6b591d8e4718e7af2662","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"57","description":"Barcelona Universal","type":"ATLAS"},"to":{"code":"21","description":"Viladomat Barcelona","type":"ATLAS"},"date":"2021-08-20","time":"12:15:00","pickup":{"address":"Avinguda Del Para Lel,76-80  ","number":null,"town":"BARCELONA","zip":"08001","description":"You will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":41.375161,"longitude":2.168421,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":12738,"stopName":"RECEPTION BON VIATJE","image":null}},"paxes":[{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"DRVR","name":"CANT FIND DRIVER","description":"In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"RESTACCESS","name":"restricted access","description":"Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"},{"id":"PLEGACHAIR","name":"Foldable wheelchairs","description":"Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":15,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nYou will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 15 minutes\n\n* Maximum capacity per vehicle: 7 Suitcase\/s\n\n* In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.\n* Remember to bring a printed copy of this voucher and a valid photo ID with you.\n* Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.\n* Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.\n* Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":63.43,"netAmount":63.43,"currencyId":"EUR"},"cancellationPolicies":[{"amount":63.43,"from":"2021-08-19T00:00:00","currencyId":"EUR"}],"factsheetId":1419,"arrivalFlightNumber":null,"departureFlightNumber":null,"arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[],"sourceMarketEmergencyNumber":"+34871180153","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/102-10949901\/id\/2","method":"DELETE"}]}],"clientReference":"W5ONZCS1TL3VJDSSXULT","remark":"","invoiceCompany":{"code":"E14"},"supplier":{"name":"HOTELBEDS SPAIN, S.L.U","vatNumber":"ESB28916765"},"totalAmount":126.86,"totalNetAmount":126.86,"pendingAmount":126.86,"currency":"EUR","links":[{"rel":"self","href":"\/booking\/en\/reference\/102-10949901","method":"GET"},{"rel":"bookingDetail","href":"\/booking\/en\/reference\/102-10949901","method":"GET"},{"rel":"bookingCancel","href":"\/booking\/en\/reference\/102-10949901","method":"DELETE"}]}]}';
                $response = json_decode($testActivityData,true);
        } elseif($promise) { 
            $resp = Promise\settle($promise)->wait();
             try {
                 if($resp[0]['state'] =='fulfilled'){
                     $response = json_decode($resp[0]['value']->getBody(), true);
                 } else {
                     $response = [ "error" => [ "message" => $resp[0]['reason']->getMessage()]];
                 }
              } catch (\Exception $e) {
                  $response = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
             }           
        }
         if(env("APP_LOG",false)){ 
            file_put_contents("book-log-".date('Y-m-d-h-i')."-activity-req.json",  json_encode($data,JSON_HEX_APOS));
            file_put_contents("book-log-".date('Y-m-d-h-i')."-activity-resp.json",  json_encode($response,JSON_HEX_APOS));        
         }
        return [$data, $response];           
    }
}
