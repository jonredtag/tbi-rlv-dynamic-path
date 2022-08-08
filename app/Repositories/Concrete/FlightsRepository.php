<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\APIInterface;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;

class FlightsRepository  implements APIInterface{
    protected $_apiClient;
    private $baseFlightApiUrl;
    private $baseFlightRefundableApiUrl;

    function __construct() {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
                'verify' => false,
            ]
        );

        $this->baseFlightApiUrl = config('api.flight');
        $this->baseFlightRefundableApiUrl = config('api.flight-refundable');
    }

    public function search($params) {
        if(!isset($params['sessionID'])) {
            $query = [
                "searchRQ" =>  [
                    "version" =>  "v1",
                    "inputs" =>  [
                        "tripType" =>  $params['trip'],
                        "cabinType" =>  $params['cabinType'],
                        "nearbyAirports" =>  "1",
                        "transat" =>  "0",
                        "nonStop" =>  "0",
                        "pax" =>  $params['pax'],
                        "slices" => $params['slices'],
                    ]
                ]
            ];
            $response = $this->_apiClient->request('POST', "search", [
                "query" => [
                    'q' => json_encode($query)
                ]
            ]);
            $data = json_decode($response->getBody(), true);

            if(!isset($data['error'])) {
                Cache::put('ft-'.$data['data']['session']['id'], $data, 30);
            }
        } else {
            $data = Cache::get('ft-'.$params['sessionID']);
        }

        if(isset($data['data'])) {
            $segmentData = $data['data']['flightResults']['extras']['slices'];
            $segments = [];

            foreach ($data['data']['flightResults']['rows'] as $flight) {
                if($params['return']) {
                    if($flight['itineraries'][0] === $params['key']){
                        $segmentID = $flight['itineraries'][1];
                    } else {
                        continue;
                    }
                } else {
                    $segmentID = $flight['itineraries'][0];
                }
                if(empty($segments[$segmentID])) {
                    $segments[$segmentID] = $segmentData[$segmentID];
                    $segments[$segmentID]['pricing'] = $flight['priceInfo']['cheapest'];
                } else if ($segments[$segmentID]['pricing']['saleTotal']['amount'] > $flight['priceInfo']['cheapest']['saleTotal']['amount']) {
                    $segments[$segmentID]['pricing'] = $flight['priceInfo']['cheapest'];
                }
            }

            if(!$params['return']) {
                Cache::put('ft-flightSegments' . $data['data']['session']['id'], $segments, 30);
            }

            $extras = $data['data']['flightResults']['extras'];

            $return = [
                "segments" => $segments,
                "sessionID" => $data['data']['session']['id'],
                "carriers" => $extras['carriers'],
                "airports" => $extras['airports']
            ];
        } else {
            $return = $data;
        }

        return $return;
    }

    public function paginate($params) {

    }

    public function filter($params) {

    }

    public function sort($params) {

    }

    public function details($params) {

    }


    public function autocomplete($term='')
    {
        $response = $this->_apiClient->request('GET', config('api.flight-autocomplete'), [
            "query" => [
                'q' => $term
            ]
        ]);
        $data = json_decode($response->getBody(), true);

        return $data['data'];
    }

    public function getRow($keys, $sessionID)
    {
        $data = Cache::get('ft-'.$sessionID);

        foreach ($data['data']['flightResults']['rows'] as $index => $flight) {
            if(count(array_diff_assoc($keys, $flight['itineraries'])) === 0) {
                return $flight['id'];
            }
        }
        return false;
    }

    public function getSelectedResult($params){
        $result = false;
        $data = $this->getSearchData($params['sessionData']['sessionID']);
        if(!isset($data))
            return $result;

        $items = $data['flightResults']['rows'];

        foreach($items as $item){
            if($item['id'] == $params['rowId'])
                $result = $item;
        }
        if(!empty($result)){
            $result['refundable'] = $result['refundable'] ?? false;

            $result['sessionId'] = $result['refundable'] ? $params['sessionData']['refundableSessionID'] : $params['sessionData']['sessionID'];
            $result['resultId'] = $result['refundable'] ? $params['sessionData']['refundableResultsID'] : $params['sessionData']['resultsID'];

            $result['itineraryIDs'] = $result['itineraries'];
            foreach ($result['itineraries'] as $i => $value) {
                $result['itineraries'][$i] = $data['flightResults']['extras']['slices'][$value];
            }
            $result['extras'] = [
                'carriers' => $data['flightResults']['extras']['carriers'],
                'airports' => $data['flightResults']['extras']['airports']
            ];
        }
        return $result;
    }

    public function verify($params) {
        $query = [
            "session" => [
                "id" => $params['sessionId']
            ],
            "verifyRQ" => [
                "version" => "v1",
                "siteId" => "bookseats",
                "inputs" => [
                    "resultId" => $params['resultId'],
                    "rowId" => $params['rowId'],
                    "fareFamilyIDs" => [],
                    // add affiliateID
                ]
            ]
        ];

        try{
            $response = $this->_apiClient->request('POST', (!empty($params['refundable']) ? $this->baseFlightRefundableApiUrl : $this->baseFlightApiUrl)."verify", [
                "query" => [
                    'q' => json_encode($query)
                    ]
                ]);
            if($response->getstatusCode() == 200){
                $respData = json_decode($response->getBody(), true);
                return $respData;
            } else {
                // error handling
                return $this->_generateErrorRenponse("T301", "Connection Problem");
            }

        } catch (GuzzleException $e){
            // handle error
            return $this->_generateErrorRenponse("T301", "Connection Problem");
        }

        return false;
    }

    public function terms($params) {
        $query = [
            "session" => [
                "id" => $params['sessionId']
            ],
            "termsRQ" => [
                "version" => "v1",
                "siteId" => "bookseats",
                "inputs" => [
                    "resultId" => $params['resultId'],
                    "rowId" => $params['rowId'],
                    "fareFamilyIDs" => [],
                    // add affiliateID
                ]
            ]
        ];

        $userData = \Cache::get($_GET['sid']);

        try{
            $response = $this->_apiClient->request('POST', ($params['refundable'] ? $this->baseFlightRefundableApiUrl : $this->baseFlightApiUrl)."terms", [
                "query" => [
                    'q' => json_encode($query)
                ]
            ]);
            if($response->getstatusCode() == 200){
                $respData = json_decode($response->getBody(), true);

                return $respData;
            } else {
                // error handling
                return $this->_generateErrorRenponse("T301", "Connection Problem");
            }

        } catch (GuzzleException $e){
            // handle error
            return $this->_generateErrorRenponse("T301", "Connection Problem");
        }

        return false;
    }

    public function book($params) {
        list($expiryMonth, $expiryYear) = explode('/', $params['paymentInformation']['expiry']);
        $data = [
            "session"=> [
                "id"=> $params['sessionId']
            ],
            "bookRQ"=> [
                "version"=>"v1",
                "session"=> [
                    "id"=> $params['sessionId']
                 ],
                "siteId"=>config('site.flt_affiliate'),
                "inputs"=>[
                    "cartID"=> $params['cartId'],
                    "contact"=> [
                        "dayTimePhone"=>"",
                        "eveningPhone"=>"",
                        "email"=>"",
                        "address"=>[
                            "street" => $params['paymentInformation']['address'],
                            "city" => $params['paymentInformation']['city'],
                            "province" => $params['paymentInformation']['province'],
                            "postalCode" => $params['paymentInformation']['postal'],
                            "country" => "CA"
                        ]
                    ],
                    "payment"=> [
                        "cardHolder" => $params['paymentInformation']['holder'],
                        "ccNumber" => '4111111111111111', // $params['paymentInformation']['cardNumber'],
                        "ccType"=> 'VI',
                        // "ccType"=> $cardType,
                        "ccExpiry"=>$expiryYear."-".$expiryMonth,
                        "ccCVV" => $params['paymentInformation']['security'],
                        "ccAddress"=>[
                            "street"=> $params['paymentInformation']['address'],
                            "city"=> $params['paymentInformation']['city'],
                            "province"=> $params['paymentInformation']['province'],
                            "postalCode"=> $params['paymentInformation']['postal'],
                            "country" => 'CA'
                        ]
                    ],
                ]
            ]
        ];

        if($params['isPackage']) {
            $data['bookRQ']['siteId'] = 'bookseats';
        }

        foreach ($params['passengerInformation'] as $i => $pax) {
            $paxAge = $this->_calculateAge($pax['year'].$pax['month'].$pax['day'], date('Ymd'));
            if($paxAge < 2){
                $type = "INF";
            } elseif($paxAge < 12){
                $type = "C".$this->_numPad($paxAge);
            } else {
                $type = "ADT";
            }

            $data['bookRQ']['inputs']['passengers'][] = [
                "id" => "1.".$i,
                "title" => $pax['title'],
                "firstname" => $pax['first'],
                "lastName" => $pax['last'],
                "middleName" => $pax['middle'],
                "dob" => $pax['year'].'-'.$pax['month'].'-'.$pax['day'],
                "age" => $paxAge,
                "type" => $type
            ];
            if(isset($pax['isPrimary']) && $pax['isPrimary']){
                $data['bookRQ']['inputs']['contact']['email'] = $pax['email'];
                $data['bookRQ']['inputs']['contact']['dayTimePhone'] = preg_replace('/[^0-9]/', '', $pax['phone']);
            }
        }

        // echo "<pre>";
        // print_r($data);
        // die();

        try{
            $bookDevTest = env('BOOK_DEV_TEST',0);
            if ($bookDevTest) {
                $responseData = '{"data":{"session":{"id":"UID5de141f6bd1232.89189629"},"cartResult":{"bookingInfo":{"flight":{"confirmationNumber":"MQPBMA","bookingStatus":"PENDING","bookingDate":"2019-11-29 11:09:51","vendor":"Intair"},"insurance":{"bookingInfo":{"bookingStatus":"Decline"}}},"passengerInfo":[{"passengerType":"ADT","age":33,"sequenceNumber":1.1,"dob":"1986-10-15","firstName":"Albertz","lastName":"Perryz","middleName":"","title":"Mr","gender":"M"}],"contactInfo":{"primaryPhoneAreaCode":"5555555555","primaryPhone":"-","altPhoneAreaCode":"","altPhone":"-","email":"albert@redtag.ca"},"paymentInfo":{"ccType":"VI","ccCardHolder":"Albertz Perryz","cardNumber":"4111xxxxxx1111","expiry":"2023-12","ccStreet":"5450 Explorer Dr","ccCity":"Mississauga","ccProvince":"ON","ccPostalCode":"L4W5N1","ccCountry":"CA","ccCVV":"XXX"},"products":{"insurance":{"insurancePassengerInfo":[{"name":"Mr. Albertz Perryz","status":"declined"}],"insuranceDetails":{"insuranceDeclined":true}},"flight":{"rowId":"IA5de14205652ca1.40125749","API":"Intair","price":{"searchPrice":488,"verifyPrice":487},"slices":[{"duration":588,"segments":[{"origin":"YUL","destination":"YYZ","bookingInfos":{"bookingCode":"K","bookingCodeCount":"5","cabin":"DH4"},"connection":{"duration":"105"},"flight":{"carrier":"DL","number":"7072"},"legs":[{"aircraft":{"code":"DH4","name":"DASH 8-400"},"arrival":"2019-12-19T17:00-05:00","departure":"2019-12-19T15:15-05:00","destination":"YYZ","origin":"YUL","duration":"105","operationalFlight":{"carrier":"WS"},"operationalDisclosure":{"disclosureText":"WESTJET ENCORE"},"cabin":"Economy Class"}]},{"origin":"YYZ","destination":"LAS","bookingInfos":{"bookingCode":"K","bookingCodeCount":"4","cabin":"73W"},"connection":{"duration":"308"},"flight":{"carrier":"DL","number":"7164"},"legs":[{"aircraft":{"code":"73W","name":"BOEING 737-700"},"arrival":"2019-12-19T22:03-05:00","departure":"2019-12-19T19:55-05:00","destination":"LAS","origin":"YYZ","duration":"308","operationalFlight":{"carrier":"WS"},"cabin":"Economy Class"}]}],"stopCount":1},{"duration":505,"segments":[{"origin":"LAS","destination":"YYZ","bookingInfos":{"bookingCode":"V","bookingCodeCount":"7","cabin":"73H"},"connection":{"duration":"254"},"flight":{"carrier":"DL","number":"7163"},"legs":[{"aircraft":{"code":"73H","name":"BOEING 737 800"},"arrival":"2019-12-22T20:24-05:00","departure":"2019-12-22T13:10-05:00","destination":"YYZ","origin":"LAS","duration":"254","cabin":"Economy Class"}]},{"origin":"YYZ","destination":"YUL","bookingInfos":{"bookingCode":"V","bookingCodeCount":"6","cabin":"73W"},"connection":{"duration":"80"},"flight":{"carrier":"DL","number":"7194"},"legs":[{"aircraft":{"code":"73W","name":"BOEING 737-700"},"arrival":"2019-12-23T00:35-05:00","departure":"2019-12-22T23:15-05:00","destination":"YUL","origin":"YYZ","duration":"80","cabin":"Economy Class"}]}],"stopCount":1}],"rateInfo":{"pricingInfo":{"passengers":{"ADT":{"baseFare":"329","taxes":158.91,"totalFare":487.91,"currency":"CAD","code":"ADT","quantity":1,"taxBreakdown":{"taxes":[{"Amount":"12.10","TaxCode":"CA","TaxName":"CA","TicketingTaxCode":""},{"Amount":"1.04","TaxCode":"RC","TaxName":"RC","TicketingTaxCode":""},{"Amount":"19.60","TaxCode":"XG","TaxName":"XG","TicketingTaxCode":""},{"Amount":"2.99","TaxCode":"XQ","TaxName":"XQ","TicketingTaxCode":""},{"Amount":"49.40","TaxCode":"US","TaxName":"US","TicketingTaxCode":""},{"Amount":"7.82","TaxCode":"YC","TaxName":"YC","TicketingTaxCode":""},{"Amount":"9.29","TaxCode":"XY","TaxName":"XY","TicketingTaxCode":""},{"Amount":"5.26","TaxCode":"XA","TaxName":"XA","TicketingTaxCode":""},{"Amount":"7.44","TaxCode":"AY","TaxName":"AY","TicketingTaxCode":""},{"Amount":"5.97","TaxCode":"XF","TaxName":"XF","TicketingTaxCode":""},{"Amount":"38.00","TaxCode":"SQ","TaxName":"SQ","TicketingTaxCode":""}],"non-taxes":[]}}},"total":487.91,"totalBase":329,"totalTaxes":158.91,"totalDiscount":0}},"extras":{"carriers":{"DL":{"code":"DL","name":"Delta","logoUrl":"http:\/\/www.redtag.ca\/public\/img\/carrier\/icon\/medium\/dl.png"}},"airports":{"LAS":{"code":"LAS","short":"McCarran","name":"McCarran International Airport","city":"Las Vegas","location":"Las Vegas, Nevada, United States","long":"Las Vegas, NV"},"YUL":{"code":"YUL","short":"Elliott Trudeau","name":"Montreal \/ Pierre Elliott Trudeau International Airport","city":"Montreal","location":"Montreal, Quebec, Canada","long":"Montreal, QC"},"YYZ":{"code":"YYZ","short":"Pearson Intl","name":"Lester B. Pearson International Airport","city":"Toronto","location":"Toronto, Ontario, Canada","long":"Toronto, ON"}},"aircrafts":{"DH4":{"code":"DH4","name":"DASH 8-400","price":488},"73W":{"code":"73W","name":"BOEING 737-700","price":488},"73H":{"code":"73H","name":"BOEING 737 800","price":488}}}}},"id":"TR5de14205779f89.52646682logee"}}}';
            } else {
                 $response = $this->_apiClient->request('POST', (!empty($params['refundable']) ? $this->baseFlightRefundableApiUrl : $this->baseFlightApiUrl)."book", [
                    "query" => [
                        'q' => json_encode($data)
                    ]
                ]);
                if($response->getstatusCode() == 200){
                    $responseData = $response->getBody();
                } else {
                    // error handling
                    $responseData = json_encode($this->_generateErrorRenponse("T301", "Connection Problem"));
                }
            }
        } catch (GuzzleException $e){
            // handle error
            $responseData = json_encode($this->_generateErrorRenponse("T301", "Connection Problem"));
        }

        $data['bookRQ']['inputs']['payment']['ccNumber'] = substr_replace($data['bookRQ']['inputs']['payment']['ccNumber'], '***********', 3, -2);
        return [json_encode($data), $responseData];
    }

    private function _generateErrorRenponse($code, $message){
        return [
            'error' => [
                'code' => $code,
                'message' => $message
            ]
        ];
    }

    private function _calculateAge($dob, $curDate){
        return intval( substr($curDate - date('Ymd', strtotime($dob)), 0, -4) );
    }

    function _numPad($num) {
	    $n = 0;
	    if($num<10) $n=2;

	    return str_pad((int) $num,$n,"0",STR_PAD_LEFT);
  	}

    public function getSearchData($sessionID){
        $data = Cache::get('ft-'.$sessionID);

        return $data['data'];
    }


    public function convertToDuration($duration) {
        $hours = floor($duration / 60);
        $minutes = $duration - ($hours * 60);
        return $hours . "h" . " " . $minutes . "m";
    }

    public function convertToTime($time, $format="g:i a", $long = true) {
        //if ($long) $time = substr($time, 0, -6);
        if ($long) {
            $tmp = explode('T', $time);
            $tmp[1] = substr($tmp[1], 0, 5);
            $time = $tmp[0].'T'.$tmp[1];
        }
        $time = strtotime($time);
        $time = date($format, $time);

        return $time;
    }

    public static function getLegLayover(&$segments)
    {
        foreach ($segments as $segment_count => $segment){
            foreach ($segment['legs'] as $leg_count => $leg){

                $layover = true;
                if (isset($segment['legs'][($leg_count + 1)]['departure'])) {
                    $departure = $segment['legs'][($leg_count + 1)]['departure'];
                } elseif (isset($segments[($segment_count + 1)]['legs'][0]['departure'])) {
                    $departure = $segments[($segment_count + 1)]['legs'][0]['departure'];
                } else {
                    $layover = false;
                }
                // $segments[$segment_count]['legs'][$leg_count]['layoverTime'] = 'fake min/hour';
                // $segments[$segment_count]['legs'][$leg_count]['layoverStop'] = 'fake IATA';
                return;
                if ($layover) {
                    $time = substr($departure, 0, -6);
                    $timestring = strtotime($time);

                    $arrival = $leg['arrival'];
                    $time = substr($arrival, 0, -6);

                    $duration = $timestring - strtotime($time);
                    $duration = $duration / 60;

                    if ($duration > 60) {
                        $hours = floor($duration / 60);
                        $duration = $duration - $hours * 60;
                        $hours = $hours . "h";
                    } else {
                        $hours = "";
                    }
                    $minutes = $duration;
                    $minutes = $minutes . "m";

                    $segments[$segment_count]['legs'][$leg_count]['layoverTime'] = $hours . " " . $minutes;
                    $segments[$segment_count]['legs'][$leg_count]['layoverStop'] = $leg['destination'];

                }

            }
        }
    }
}
