<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Promise;
use App\Helper\Helpers;
use App\Models\HotelMapping;

class AddonRepository{
    protected $_apiClient;

    function __construct() {
        $this->baseTranferApiUrl = config('api.transfer');
        $this->baseActivityApiUrl = config('api.activity');
        $this->ip = Helpers::getClientIp();
        $this->_apiClient = new Guzzle();
    }

    public function search($param){
        $response = [];
        $pax =  $param['pax'];
        if(isset($param['transfer'])){
              // for testing purpose
            $transferSearch  = $param['transfer'];
            $hotelCode = $transferSearch['hotelBedsCode'];
               // $hotelBedsCode = '177454';
            $hotelPointType = 'ATLAS';
            if(empty($hotelCode)){
                $hotelPointType = 'GPS';
                $hotelCode = $transferSearch['hotelGeo']['geoCoordinates']['Lat'].",".$transferSearch['hotelGeo']['geoCoordinates']['Lon'] ;
            }
                /*
                $data['transfer'] = [
                        "version" => "v1",
                        "inputs" => [
                            "fromType"=>'IATA',
                            "fromCode"=>$param['airportCode'],
                            "toType"=>$hotelPointType,
                            "toCode"=>$hotelCode,
                            "time"=> $arrTime,
                            "returnTime"=>$depTime,
                            "noCache"=>true,
                            "adults"=> $pax['adults'],
                            "children"=> $pax['children'],
                            "infants"=> $pax['infants'],
                            "userIp" => $this->ip,
                            "userAgent" => $_SERVER['HTTP_USER_AGENT']
                        ]
                ]; 
                $promise['transfer'] = $this->_apiClient->requestAsync('GET', $this->baseTranferApiUrl. "search", [
                        "query" => [
                            'q' => json_encode(["searchRQ"=> $data['transfer']])
                        ]
                 ]);
                */
                $fromType='IATA';
                $fromCode=$transferSearch['airportCode'];
                $toType=$hotelPointType;
                $toCode=$hotelCode;
                $outbound=$transferSearch['outbound'];
                $inbound=$transferSearch['inbound'];
                $adults= $pax['adults'];
                $children= $pax['children'];
                $infants= $pax['infants'];
                $header=array(
                    'headers' => [
                                        'Api-key' => '43843caeae308bf86b14c863b6b844c3',
                                        'X-Signature' => hash("sha256", '43843caeae308bf86b14c863b6b844c3' . '533dca8574' . time()),
                                        'Content-Type' => 'application/json',
                        ],
                    );
            $url = "https://api.test.hotelbeds.com/transfer-api/1.0/availability/en/";  
            $url .="from/$fromType/$fromCode/to/$toType/$toCode/$outbound/$inbound/$adults/$children/$infants";
            $data['transfer'] = $url;
            $promise['transfer'] = $this->_apiClient->getAsync($url, $header);  
        }        
        if(isset($param['activity'])){
                 $activitiSearch = $param['activity'];   
                 /*
                 $activityQuery = [
                        "version" => "v1",
                        "inputs" => [
                            "destination"=>$param['airportCode'],
                            "from"=> $fromDate,
                            "to"=>$toDate,
                            "adults"=>$pax['adults'],
                            "ages"=>$pax['ages'],
                        ]
                ];  
               
                $promise['activity'] = $this->_apiClient->requestAsync('GET', $this->baseActivityApiUrl. "search", [
                        "query" => [
                            'q' => json_encode(["searchRQ"=>$activityQuery])
                        ]
                 ]);
                */
                 if(isset($activitiSearch['hotelGeo'])){
                     $searchFilterItem = ["type"=>"gps", "latitude"=>$activitiSearch['hotelGeo']['geoCoordinates']['Lat'], "longitude"=>$activitiSearch['hotelGeo']['geoCoordinates']['Lon']];
                 } elseif(isset($activitiSearch['hotebedDestCode'])){
                     $searchFilterItem = ["type"=>"hotel", "value"=>$activitiSearch['hotebedDestCode']];
                 } else {
                     $searchFilterItem = ["type"=>"destination", "value"=>$activitiSearch['airportCode']];
                 }
                 
                $data['activity'] = array(
                     "filters"=> [ array(
                                        "searchFilterItems"=>[$searchFilterItem]
                                            )
                                    ],
                    "from"=> $activitiSearch['from'],
                    "to"=> $activitiSearch['to'],
                );
         
               $header= array(
                            'headers' => [
                                'Api-key' => 'da60c840c8ced101802166b6f9a24a0a',
                                'X-Signature' => hash("sha256", 'da60c840c8ced101802166b6f9a24a0a' . '296d9ae3ae' . time()),
                                'Content-Type' => 'application/json',
                            ],
                            'body' => json_encode($data['activity'])
                        );
           $promise['activity'] = $this->_apiClient->postAsync('https://api.test.hotelbeds.com/activity-api/3.0/activities', $header);  
        }
        $results = Promise\settle($promise)->wait();
        foreach ($results as $key => $resp) {
            try {
                if($resp['state'] =='fulfilled'){
                    $responses[$key] = json_decode($resp['value']->getBody(), true);
                } else {
                    $responses[$key] = [ "error" => [ "message" =>  $resp['reason']->getMessage()]];
                }
            }catch (\Exception $e) {
                $responses[$key] = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
            }
        }
        
       // file_put_contents("search-log-".date('Y-m-d-h-i')."-transfer-req.json",   $data['transfer']);
       // file_put_contents("search-log-".date('Y-m-d-h-i')."-transfer-resp.json",  json_encode($responses['transfer'],JSON_HEX_APOS));
       // file_put_contents("search-log-".date('Y-m-d-h-i')."-activity-req.json",  json_encode($data['activity'],JSON_HEX_APOS));
      //  file_put_contents("search-log-".date('Y-m-d-h-i')."-activity-resp.json",  json_encode($responses['activity'],JSON_HEX_APOS));
        return $responses;
        
    }
    
    public function book($params)
    {
        $paxs =  $params['paxs'];
        $mainPax = $paxs[0];
        if(isset($params['transfer'])){
            /*
            $services = [];
            foreach($params['rateKeys']['transfer'] as $roundTrip){
                $services[] = $roundTrip['arrId'];
                $services[] = $roundTrip['depId'];
             }
            $data['transfer'] = [
                "session"=> [
                    "id"=> $params['sessionId']['transfer']
                ],          
                "bookRQ"=> [
                    "version"=>"v1",
                    "inputs"=> [
                        "services"=>$services,
                          "passengers"=> [
                            // "title"=> $holder['title'],
                             "title"=> "Mr",
                            "firstName"=> $holder['name'],
                            "lastName"=> $holder['surname'],
                         ],
                        "contact"=> [
                            "dayTimePhone"=>$holder['phone'],
                            "email"=>$holder['email'],
                        ],
                        "userIp"=> $this->ip,
                        "userAgent" => $_SERVER['HTTP_USER_AGENT']
                    ]
                ]
            ];
            */
            $transfers = [];
            $transferBookParam = $params['transfer'];
            $searchParam = $transferBookParam['searchParam'];
            $depFlightCode =  $searchParam['depFlightCode'];
            $arrFlightCode = $searchParam['arrFlightCode'];
            $location = empty($searchParam['hotelBedsCode'])? [
                               "name"=>$searchParam['hotelName'],
                                "address"=> $searchParam['hotelGeo']['address']['ad1'],
                                "town"=> empty($searchParam['hotelGeo']['address']['city'])?
                                                        $searchParam['hotelGeo']['address']['countryCode']:$searchParam['hotelGeo']['address']['city'],
                                "country"=> $searchParam['hotelGeo']['address']['countryCode'],
                                "zip"=>$searchParam['hotelGeo']['address']['postalCode']
                           ]:null;
            foreach($transferBookParam['results'] as $roundTrip){
                $tranferTmp = [
                        "rateKey"=>$roundTrip['rateKeys']['arr'],
                        "transferDetails"=> [
                            [
                                "code"=> $arrFlightCode,
                                "direction"=>"DEPARTURE",
                                "type"=> "FLIGHT",
                                 "companyName" => null,
                           ],
                        ], 
                    ];
                if(isset($location)){
                       $tranferTmp["pickupInformation"] =  $location;  
                } 
                $transfers[] = $tranferTmp;
                $tranferTmp = [
                        "rateKey"=>$roundTrip['rateKeys']['dep'],
                        "transferDetails"=> [
                            [
                                "code"=> $depFlightCode,
                                "direction"=>"ARRIVAL",
                                "type"=> "FLIGHT",
                                "companyName" => null,
                           ],
                        ],
                    ];
                if(isset($location)){
                       $tranferTmp["dropoffInformation"]=$location;  
                } 
                $transfers[] = $tranferTmp ;                 
            }    
            
            $holder =  array(
                // 'title'=>$mainPax['title'],
                 'name'=>$mainPax['first'].(!empty($mainPax['middle'])?' '.$mainPax['middle']:''),
                 'surname'=>$mainPax['last'],
                 'email'=>$mainPax['email'],
                 'phone'=> str_replace("-", "", $mainPax['phone']),
             );
             $data['transfer'] = [
                "language"=>$params['lang'],
                "holder"=>$holder,
                "transfers"=> $transfers,
                 "clientReference"=>"package-".$params['packageBookingId'],
                 "welcomeMessage"=> "Welcome",
                 "remark"=>"Booking remarks go here.",
             ];
          
           $header=
            [
                'headers' => [
                    'Api-key' => '43843caeae308bf86b14c863b6b844c3',
                    'X-Signature' => hash("sha256", '43843caeae308bf86b14c863b6b844c3' . '533dca8574' . time()),
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($data['transfer'])
            ];
           $promise['transfer'] = $this->_apiClient->postAsync('https://api.test.hotelbeds.com/transfer-api/1.0/bookings', $header);  
           /* 
            $promise['transfer'] = $this->_apiClient->requestAsync('GET', $this->baseTranferApiUrl. "book", [
                        "query" => [
                            'q' =>json_encode($data['transfer'])
                        ]
              ]);
             */            
        } 
        if(isset($params['activity'])){
             $holder =  array(
                 'title'=>$mainPax['title'],
                 'name'=>$mainPax['first'].(!empty($mainPax['middle'])?' '.$mainPax['middle']:''),
                 'surname'=>$mainPax['last'],
                 'email'=>$mainPax['email'],
                 'telephones'=> [str_replace("-", "", $mainPax['phone'])],
             );
             $paxList =  [];
             foreach($paxs as $pax){
                 $age = Helpers::getAge($pax['year'].'-'.$pax['month'].'-'.$pax['day']);
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
                               
                               case 'HOTEL_NAME':
                                   $questionRet = $activitySearchParam['hotelName'];
                                   break;
                               
                               case 'DIRECCIONHTL':
                                   $address = $activitySearchParam['hotelGeo']['address'];
                                   $questionRet = $address['ad1'].','.$address['city']
                                           .','.$address['stateProvinceCode'].','.$address['countryCode']
                                           .','.$address['postalCode'];
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
            $data['activity'] = array(
                "language"=>"en",
                "clientReference"=>"package-".$params['packageBookingId'],
                "holder"=>$holder,
                "activities"=>$activityList,
            );
            $header= [
                        'headers' => [
                            'Api-key' => 'da60c840c8ced101802166b6f9a24a0a',
                            'X-Signature' => hash("sha256", 'da60c840c8ced101802166b6f9a24a0a' . '296d9ae3ae' . time()),
                            'Content-Type' => 'application/json',
                        ],
                        'body' => json_encode($data['activity'])
                    ];
           $promise['activity'] = $this->_apiClient->putAsync('https://api.test.hotelbeds.com/activity-api/3.0/bookings', $header);              
        } 
        $bookDevTest = env('BOOK_DEV_TEST',0);
        if(false){
       // if($bookDevTest){
            if(isset($data['transfer'])){
                $testTransferData = '{"bookings":[{"reference":"69-3302400","bookingFileId":null,"creationDate":"2021-03-12T16:33:11","status":"CONFIRMED","modificationsPolicies":{"cancellation":true,"modification":true},"holder":{"name":"testa","surname":"tangz","email":"arthur@uplift.com","phone":"5555551234"},"transfers":[{"id":1,"rateKey":"DEPARTURE|ATLAS~GPS|14551~21.093372,-86.7684707|IATA|CUN|2021-04-23|03:00|2021-04-23|06:10|2~0~0|4|55072|PRVMVLCAN2021|55072|PRVMVLCAN2021|69|PRVT|D|MVEL|PRM|18.31|CANCUN|CUN|21591|2051|CUN|SIMPLE|baeb7ae1c05bed6471746094cae05c0b","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"21.09,-86.77","description":"The Ritzcarlton Cancun, Retorno Del Rey 36, 77500 Cancun, MEX","type":"GPS"},"to":{"code":"CUN","description":"Cancun, Cancun Int. Airport","type":"IATA"},"date":"2021-04-23","time":"03:00:00","pickup":{"address":"Retorno Del Rey 36","number":"","town":"Cancun","zip":"77500","description":"You will be picked up at the hotel motor lobby. If you are unable to locate the driver\/agent, please call NEXUS TOURS on +(52) 998 251 6559 \/ + 52 998 179 4060 (WhatsApp). Languages spoken at the call centre: English, Spanish. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":21.09,"longitude":-86.77,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":21591,"stopName":"hotel motor lobby","image":""}},"paxes":[{"type":"ADULT"},{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"CHAC","name":"CHANGE OF ACCOMMODATION","description":"If you change your accommodation during your holiday, you must inform us at least 48 hours before the departure of your flight so that we can update the details of your transfer.","type":"GENERIC_GUIDELINES"},{"id":"CHFL","name":"CHANGE OF FLIGHT ","description":"If you change your return flight during your holiday, you must inform us at least 48 hours before the departure of your flight so that we can update the details of your transfer.","type":"GENERIC_GUIDELINES"},{"id":"EXLU","name":"EXCESS LUGGAGE","description":"If you arrive at the destination with an excess of luggage, you will have to pay an additional charge for the extra undeclared weight. ","type":"GENERIC_GUIDELINES"},{"id":"LGPR","name":"LUGGAGE PROBLEMS","description":"In the event of a delay on your flight or a problem with customs or luggage,  please call the emergency number in order to advise of the delay and take the necessary steps.","type":"GENERIC_GUIDELINES"},{"id":"STFF","name":"CANT FIND STAFF ","description":"In the event of being unable to locate a staff member, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"MTPT","name":"CANT FIND MEETING POINT","description":"In the event of being unable to locate the meeting point, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"VINT","name":"INTERNATIONAL FLIGHTS","description":"For International flights, you are advised to be at the airport 3 hours before the departure of the flight.","type":"GENERIC_GUIDELINES"},{"id":"VDOM","name":"DOMESTIC FLIGHTS","description":"For domestic flights, you are advised to be at the airport 2 hours before the departure of the flight.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":15,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nYou will be picked up at the hotel motor lobby. If you are unable to locate the driver\/agent, please call NEXUS TOURS on +(52) 998 251 6559 \/ + 52 998 179 4060 (WhatsApp). Languages spoken at the call centre: English, Spanish. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 15 minutes\n\n* Extra baggage allowed without additional fees per person: 2 Suitcase\/s\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":26.95,"netAmount":26.95,"currencyId":"EUR"},"cancellationPolicies":[{"amount":26.95,"from":"2021-04-22T00:00:00","currencyId":"EUR"}],"factsheetId":2051,"arrivalFlightNumber":null,"departureFlightNumber":"AA1547","arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[{"type":"FLIGHT","direction":"DEPARTURE","code":"AA1547","companyName":null}],"sourceMarketEmergencyNumber":"+525546240194","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/69-3302400\/id\/1","method":"DELETE"}]},{"id":2,"rateKey":"ARRIVAL|IATA|CUN|ATLAS~GPS|14551~21.093372,-86.7684707|2021-04-18|21:40|2021-04-18|21:40|2~0~0|4|55072|PRVMVLCAN2021|55072|PRVMVLCAN2021|69|PRVT|D|MVEL|PRM|19.69|CUN|CANCUN|21590|2051|CUN|SIMPLE|52623d3d25fa1c2b4d14e23c2ac7232d","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"CUN","description":"Cancun, Cancun Int. Airport","type":"IATA"},"to":{"code":"21.09,-86.77","description":"The Ritzcarlton Cancun, Retorno Del Rey 36, 77500 Cancun, MEX","type":"GPS"},"date":"2021-04-18","time":"21:40:00","pickup":{"address":null,"number":null,"town":null,"zip":null,"description":"Once you have collected your luggage, a member of the Nexus Tours team (wearing a hat and orange shirt) will be waiting for you at the ground transportation area outside the terminal with a sign with your name on it. Please note that there may be other representatives who are not affiliated by the company who may approach you offering excursions, or transfers. Please do not accept assistance or go with them. If you are unable to locate the driver\/agent, please call NEXUS TOURS on +(52) 998 251 6559 \/ + 52 998 179 4060 (WhatsApp). Languages spoken at the call centre: English, Spanish. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":21.040457,"longitude":-86.874439,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":21590,"stopName":"NEXUS TOURS team located just outside the terminal","image":null}},"paxes":[{"type":"ADULT"},{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"LGPR","name":"LUGGAGE PROBLEMS","description":"In the event of a delay on your flight or a problem with customs or luggage,  please call the emergency number in order to advise of the delay and take the necessary steps.","type":"GENERIC_GUIDELINES"},{"id":"STFF","name":"CANT FIND STAFF ","description":"In the event of being unable to locate a staff member, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"MTPT","name":"CANT FIND MEETING POINT","description":"In the event of being unable to locate the meeting point, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"},{"id":"DOMEST","name":"Domestic arrivals","description":"Domestic arrivals: Journeys made within the borders of the same country OR journeys made within European airspace (Schengen) OR from Schengen space to any of these countries: Bulgaria, Cyprus, Croatia, Ireland, United Kingdom and Romania. Passengers do not have to go through customs controll","type":"GENERIC_GUIDELINES"},{"id":"INTERNAT","name":"International arrivals","description":"International arrivals: Journeys where the departure and the arrival take place in different countries OR journeys made with the origin outside of European airspace (Schengen) and arrival into it. Passengers must pass through customs control.","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":75,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"},{"value":75,"type":"SUPPLIER_MAX_WAITING_TIME_INTERNATIONAL","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nOnce you have collected your luggage, a member of the Nexus Tours team (wearing a hat and orange shirt) will be waiting for you at the ground transportation area outside the terminal with a sign with your name on it. Please note that there may be other representatives who are not affiliated by the company who may approach you offering excursions, or transfers. Please do not accept assistance or go with them. If you are unable to locate the driver\/agent, please call NEXUS TOURS on +(52) 998 251 6559 \/ + 52 998 179 4060 (WhatsApp). Languages spoken at the call centre: English, Spanish. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 75 minutes\n* Maximum waiting time for drivers in international arrivals 75 minutes\n\n* Extra baggage allowed without additional fees per person: 2 Suitcase\/s\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":26.95,"netAmount":26.95,"currencyId":"EUR"},"cancellationPolicies":[{"amount":26.95,"from":"2021-04-17T00:00:00","currencyId":"EUR"}],"factsheetId":2051,"arrivalFlightNumber":"AA1750","departureFlightNumber":null,"arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[{"type":"FLIGHT","direction":"ARRIVAL","code":"AA1750","companyName":null}],"sourceMarketEmergencyNumber":"+525546240194","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/69-3302400\/id\/2","method":"DELETE"}]}],"clientReference":"PACKAGE-100623","remark":"","invoiceCompany":{"code":"E14"},"supplier":{"name":"CLUB TURAVIA SA DE CV","vatNumber":"CTU940107CK8"},"totalAmount":53.9,"totalNetAmount":53.9,"pendingAmount":53.9,"currency":"EUR","links":[{"rel":"self","href":"\/booking\/en\/reference\/69-3302400","method":"GET"},{"rel":"bookingDetail","href":"\/booking\/en\/reference\/69-3302400","method":"GET"},{"rel":"bookingCancel","href":"\/booking\/en\/reference\/69-3302400","method":"DELETE"}]}]}';
                $responses['transfer'] =  json_decode($testTransferData,true);
            }
            if(isset($data['activity'])){
                $testActivityData = '{"bookings":[{"reference":"102-10949901","bookingFileId":null,"creationDate":"2021-02-19T15:10:11","status":"CONFIRMED","modificationsPolicies":{"cancellation":true,"modification":true},"holder":{"name":"Prakash","surname":"Prajapati","email":"ppprajapati@netclues.com","phone":"+16543245812"},"transfers":[{"id":1,"rateKey":"DEPARTURE|ATLAS|21|ATLAS|57|2021-08-17|12:15|2021-08-17|12:15|1~0~0|4|229145|BCN MVEL BON21|229145|BCN MVEL BON21|102|PRVT|3|MVEL|PRM|59.33|BARCELONA|BARCELONA|12738|1419|BCN|SIMPLE|07c6e219cb978695d070784ac8a69c37","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"21","description":"Viladomat Barcelona","type":"ATLAS"},"to":{"code":"57","description":"Barcelona Universal","type":"ATLAS"},"date":"2021-08-17","time":"12:15:00","pickup":{"address":"Carrer De Viladomat,197  ","number":null,"town":"BARCELONA","zip":"08015","description":"You will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":41.382474,"longitude":2.153346,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":12738,"stopName":"RECEPTION BON VIATJE","image":null}},"paxes":[{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"DRVR","name":"CANT FIND DRIVER","description":"In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"RESTACCESS","name":"restricted access","description":"Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"},{"id":"PLEGACHAIR","name":"Foldable wheelchairs","description":"Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":15,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nYou will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 15 minutes\n\n* Maximum capacity per vehicle: 7 Suitcase\/s\n\n* In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.\n* Remember to bring a printed copy of this voucher and a valid photo ID with you.\n* Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.\n* Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.\n* Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":63.43,"netAmount":63.43,"currencyId":"EUR"},"cancellationPolicies":[{"amount":63.43,"from":"2021-08-16T00:00:00","currencyId":"EUR"}],"factsheetId":1419,"arrivalFlightNumber":null,"departureFlightNumber":null,"arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[],"sourceMarketEmergencyNumber":"+34871180153","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/102-10949901\/id\/1","method":"DELETE"}]},{"id":2,"rateKey":"DEPARTURE|ATLAS|57|ATLAS|21|2021-08-20|12:15|2021-08-20|12:15|1~0~0|4|229145|BCN MVEL BON21|229145|BCN MVEL BON21|102|PRVT|3|MVEL|PRM|59.33|BARCELONA|BARCELONA|12738|1419|BCN|SIMPLE|ca87384d8d9d6b591d8e4718e7af2662","status":"CONFIRMED","transferType":"PRIVATE","vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"pickupInformation":{"from":{"code":"57","description":"Barcelona Universal","type":"ATLAS"},"to":{"code":"21","description":"Viladomat Barcelona","type":"ATLAS"},"date":"2021-08-20","time":"12:15:00","pickup":{"address":"Avinguda Del Para Lel,76-80  ","number":null,"town":"BARCELONA","zip":"08001","description":"You will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.","altitude":null,"latitude":41.375161,"longitude":2.168421,"checkPickup":{"mustCheckPickupTime":false,"url":null,"hoursBeforeConsulting":null},"pickupId":12738,"stopName":"RECEPTION BON VIATJE","image":null}},"paxes":[{"type":"ADULT"}],"content":{"vehicle":{"code":"MVEL","name":"Minivan Extra Luggage"},"category":{"code":"PRM","name":"Premium"},"images":[{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/small\/prvt-prm-mvel.png","type":"SMALL"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/medium\/prvt-prm-mvel.png","type":"MEDIUM"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/large\/prvt-prm-mvel.png","type":"LARGE"},{"url":"http:\/\/media.stage.activitiesbank.com\/giata\/transfers\/TRD\/extralarge\/prvt-prm-mvel.png","type":"EXTRALARGE"}],"transferDetailInfo":[{"id":"ER","name":"Exclusive ride for you","description":null,"type":"GENERAL_INFO"},{"id":"DTDS","name":"Door to door service","description":null,"type":"GENERAL_INFO"},{"id":"M&GS","name":"Meet & Greet service","description":null,"type":"GENERAL_INFO"},{"id":"BAHB","name":"1 item of hand baggage allowed per person","description":null,"type":"GENERAL_INFO"},{"id":"DRVR","name":"CANT FIND DRIVER","description":"In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.","type":"GENERIC_GUIDELINES"},{"id":"VOUC","name":"VOUCHER ","description":"Remember to bring a printed copy of this voucher and a valid photo ID with you.","type":"GENERIC_GUIDELINES"},{"id":"RESTACCESS","name":"restricted access","description":"Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.","type":"GENERIC_GUIDELINES"},{"id":"CBBS","name":"CHILDBOOSTER \/ BABY SEAT","description":"Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.","type":"GENERIC_GUIDELINES"},{"id":"PLEGACHAIR","name":"Foldable wheelchairs","description":"Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers","type":"GENERIC_GUIDELINES"}],"customerTransferTimeInfo":[{"value":0,"type":"CUSTOMER_MAX_WAITING_TIME","metric":"minutes"}],"supplierTransferTimeInfo":[{"value":15,"type":"SUPPLIER_MAX_WAITING_TIME_DOMESTIC","metric":"minutes"}],"transferRemarks":[{"type":"CONTRACT","description":"Pick-up point:\nYou will be picked up at the hotel reception. If you are unable to locate the driver\/agent, please call BON VIATGE on 00 34 93 174 1594 or 00 34 634 546 176. Languages spoken at the call centre: Spanish, English. Please do not leave the pick-up area without having contacted the agent\/driver first. If the supplier doesnt answer the phone, please call our emergency telephone number listed at the bottom of the voucher before leaving the pick-up area.\n\nTransfer information:\n\n* Maximum client waiting time 0 minutes\n* Maximum waiting time for drivers in domestic arrivals 15 minutes\n\n* Maximum capacity per vehicle: 7 Suitcase\/s\n\n* In the event of being unable to locate the driver, please call the emergency number indicated in this voucher.\n* Remember to bring a printed copy of this voucher and a valid photo ID with you.\n* Please note that due to traffic restrictions within the city centre there are some hotels in which you will be dropped as close as possible with the chance of a short walk, instead of directly outside.\n* Child car seats and boosters are not included unless specified in your booking and can carry an extra cost. Should you need to book them, please contact your point of sale prior to travelling.\n* Adapted vehicles are suitable for foldable wheelchairs. If the wheelchair cannot be folded, an extra cost may be applicable for customers\n\n* Exclusive ride for you:  \n* Door to door service:  \n* Meet & Greet service:  \n* 1 item of hand baggage allowed per person:  \n\n","mandatory":true}]},"price":{"totalAmount":63.43,"netAmount":63.43,"currencyId":"EUR"},"cancellationPolicies":[{"amount":63.43,"from":"2021-08-19T00:00:00","currencyId":"EUR"}],"factsheetId":1419,"arrivalFlightNumber":null,"departureFlightNumber":null,"arrivalShipName":null,"departureShipName":null,"arrivalTrainInfo":null,"departureTrainInfo":null,"transferDetails":[],"sourceMarketEmergencyNumber":"+34871180153","links":[{"rel":"transferCancel","href":"\/booking\/en\/reference\/102-10949901\/id\/2","method":"DELETE"}]}],"clientReference":"W5ONZCS1TL3VJDSSXULT","remark":"","invoiceCompany":{"code":"E14"},"supplier":{"name":"HOTELBEDS SPAIN, S.L.U","vatNumber":"ESB28916765"},"totalAmount":126.86,"totalNetAmount":126.86,"pendingAmount":126.86,"currency":"EUR","links":[{"rel":"self","href":"\/booking\/en\/reference\/102-10949901","method":"GET"},{"rel":"bookingDetail","href":"\/booking\/en\/reference\/102-10949901","method":"GET"},{"rel":"bookingCancel","href":"\/booking\/en\/reference\/102-10949901","method":"DELETE"}]}]}';
                $responses['activity'] = json_decode($testActivityData,true);
            }
        } elseif($promise) { 
            $results = Promise\settle($promise)->wait();
            foreach ($results as $key => $resp) {
                try {
                    if($resp['state'] =='fulfilled'){
                        $responses[$key] = json_decode($resp['value']->getBody(), true);
                    } else {
                        $responses[$key] = [ "error" => [ "message" => $resp['reason']->getMessage()]];
                    }
                }catch (\Exception $e) {
                    $responses[$key] = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
                }
            }
        }
        
        /*
        if(isset($data['transfer'])){
            file_put_contents("book-log-".date('Y-m-d-h-i')."-transfer-req.json", json_encode($data['transfer'],JSON_HEX_APOS));
            file_put_contents("book-log-".date('Y-m-d-h-i')."-transfer-resp.json",  json_encode($responses['transfer'],JSON_HEX_APOS));
        }
        if(isset($data['activity'])){
            file_put_contents("book-log-".date('Y-m-d-h-i')."-activity-req.json",  json_encode($data['activity'],JSON_HEX_APOS));
            file_put_contents("book-log-".date('Y-m-d-h-i')."-activity-resp.json",  json_encode($responses['activity'],JSON_HEX_APOS));        
        }
         * 
         */
        return [$data, $responses];           
       
    }
}
