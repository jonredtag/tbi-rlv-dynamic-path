<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\APIInterface;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use App\Models\HotelAutocomplete;
use Illuminate\Support\Facades\Cache;
use App\Helper\Helpers;

class HotelsRepository  implements APIInterface{
    protected $_apiClient;
    private $_baseHotelApiUrl;

    function __construct() {
        $this->_baseHotelApiUrl = config('api.hotel');//'http://res.flights.ca/hotelslib/tests/';
        $this->ip = Helpers::getClientIp();
    }

    private function init($base) {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
                'base_uri' => $base,
            ]
        );
    }

    public function search($params)
    {
        die('never used');
        try {
            $query = [
                "affiliate" => [
                    "key" => 'bookseats'
                ],
                "searchRQ" => [
                    "version" => "v1",
                    "inputs" => [
                        "locationKey" => $params['locationKey'],
                        "searchType" => "init",
                        "rooms" => $params['rooms'],
                        "radius" => "20",
                        "sort" => "DEFAULT",
                        "arrDate" => date('Y-m-d', strtotime($params['arrDate'])),
                        "depDate" => date('Y-m-d', strtotime($params['depDate'])),
                        "noOfResultsPerPage" => "200",
                        "userIP" => "210.0.50.122",
                        "userAgent" => "Firefox"
                    ]
                ]
            ];

            $this->init($this->_baseHotelApiUrl);
            $response = $this->_apiClient->request('POST', "search", [
                "query" => [
                    'q' => json_encode($query)
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            if (!isset($data['error'])) {
                Cache::put("htl-".$data['data']['session']['id'], $data, 30);

                $return = [
                    "totalResults" => $data['data']['hotelResults']['totalResults'],
                    "results" => $data['data']['hotelResults']['rows'],
                    "sessionID" => $data['data']['session']['id'],
                    "resultsId" => $data['data']['hotelResults']['resultsId'],
                ];
            } else {
                $return = $data;
            }
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            if ($e->hasResponse()) {
                echo 'body';
                echo $e->getResponse()->getBody();
            }
            echo 'error';
            echo \GuzzleHttp\Psr7\str($e->getRequest());
            echo \GuzzleHttp\Psr7\str($e->getResponse());
            die();
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            echo \GuzzleHttp\Psr7\str($e->getRequest());
            echo \GuzzleHttp\Psr7\str($e->getResponse());
            die();
        }
        return $return;
    }

    public function paginate($params)
    {

    }

    public function filter($params)
    {
        $data = Cache::get("htl-".$params['sessionID']);

        $results = [];

        $filters = [];

        if (isset($params['starRating']) && count(array_unique($params['starRating'])) > 1) {
            $filters['starRating'] = true;
        }

        if (isset($params['priceRange'])) {
            $filters['priceRange'] = true;
        }

        if (isset($params['hotelName'])) {
            $filters['hotelName'] = true;
        }

        foreach ($data['data']['hotelResults']['rows'] as $hotel) {
            $filter = ["display" => true];
            if (!empty($filters['starRating'])) {
                $filter['starRating'] = false;
                if ($params['starRating'][$hotel['hotelRating']] === 'true') {
                    $filter['starRating'] = true;
                }
            }

            if (!empty($filters['priceRange'])) {
                $filter['priceRange'] = false;
                if ($hotel['rooms']['rateInfo']['avgBaseRate'] >= $params['priceRange']['min'] && $hotel['rooms']['rateInfo']['avgBaseRate'] <= $params['priceRange']['max']) {
                    $filter['priceRange'] = true;
                }
            }

            if (!empty($filters['hotelName'])) {
                $filter['hotelName'] = false;
                if (preg_match("/$params[hotelName]/", $hotel['hotelName'])) {
                    $filter['hotelName'] = true;
                }
            }

            if (count(array_unique($filter)) === 1) {
                $results[] = $hotel;
            }
        }


        $return = [
            "totalResults" => count($results),
            "results" => $results,
            "sessionID" => $data['data']['session']['id'],
        ];

        return $return;
    }

    public function sort($params)
    {

    }

    public function details($params)
    {

    }

    public function autocomplete($term='')
    {
        $cities = HotelAutocomplete::where('DisplayType', 'Cities and Neighbourhoods');

        $terms = str_replace(","," ",strtolower(htmlspecialchars($term, ENT_QUOTES, 'UTF-8')));
        $termList = explode(" ",$terms);

        foreach($termList as $index => $term) {
            $cities->where('English', 'LIKE', "%$term%");
        }
        $cities->orderBy('weight', 'DESC')
                ->limit(10);

        $citiesData = json_decode(json_encode($cities->get()), true);


        $POI = HotelAutocomplete::where('DisplayType', 'Points of Interest');

        $terms = str_replace(","," ",strtolower(htmlspecialchars($term, ENT_QUOTES, 'UTF-8')));
        $termList = explode(" ",$terms);

        foreach($termList as $index => $term) {
            $POI->where('English', 'LIKE', "%$term%");
        }
        $POI->orderBy('weight', 'DESC')
                ->limit(10);

        $poiData = json_decode(json_encode($POI->get()), true);

        $airports = HotelAutocomplete::where('DisplayType', 'Airports');

        $terms = str_replace(","," ",strtolower(htmlspecialchars($term, ENT_QUOTES, 'UTF-8')));
        $termList = explode(" ",$terms);

        foreach($termList as $index => $term) {
            $airports->where('English', 'LIKE', "%$term%");
        }
        $airports->orderBy('weight', 'DESC')
                ->limit(10);

        $airportsData = json_decode(json_encode($airports->get()), true);

        return ["airports" => $airportsData, "cities" => $citiesData, "pois" => $poiData];
    }

    public function verify($params) {
        $query = [
            "session" => [
                "id" => $params['sessionId']
            ],
            "affiliate" => [
                "key" => 'bookseats'
            ],
            "sendLogs" => true,
            "verifyRQ" => [
                "version" => "v1",
                "inputs" => [
                    "roomIndex" => (string)$params['roomIndex'],
                    "lang" => $params['lang'],
                    "userIp" => $this->ip,
                    "userAgent" => $_SERVER['HTTP_USER_AGENT']
                ]
            ]
        ];

        try {
            $this->init($this->_baseHotelApiUrl);
            $response = $this->_apiClient->request('POST', "verify", [
                "query" => [
                    'q' => json_encode($query)
                ]
            ]);
            if ($response->getstatusCode() == 200) {
                $respData = json_decode($response->getBody(), true);

                if(empty($respData['data']) || $respData['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'] <= 0) {
                    return ["error" => ["message" => "Verify error"]];
                }

                return $respData;
            } else {
                // error handling
                echo 'there is an error 1';
                die();
            }
        } catch (GuzzleException $e) {
            // handle error
            echo 'there is an error 2';
            print_r($e->getResponse());
            die();
        }

        return json_decode('{"error":{"code":21,"message":"there is an error with the verify."}}', true);;
    }

    public function book($params)
    {
        $expiry = str_replace('/', '', $params['paymentInformation']['expiry']);
        $data = [
            "session"=> [
                "id"=> $params['sessionId']
            ],
            // "affiliate" => [
            //     "key" => 'bookseats'
            // ],
            "bookRQ"=> [
                "version"=>"v1",
                "inputs"=> [
                    "amount" => $params['cost'],
                    "baseAmount" => $params['base'],
                    // "cartID"=> $params['cartId'],
                    "contact"=> [
                        "dayTimePhone"=>"",
                        "email"=>"",
                    ],
                    "payment"=> [
                        "cardHolder" => $params['paymentInformation']['holder'],
                        "ccNumber" => str_replace('-', '', $params['paymentInformation']['card']),
                        "ccType"=>  $params['paymentInformation']['cardType'],
                        "ccExpiry"=>substr($expiry,-4,4).'-'. substr($expiry, 0,2),
                        "ccCVV" =>  $params['paymentInformation']['security'],
                        "ccAddress"=> [
                            "street"=> $params['paymentInformation']['address'],
                            "city"=> $params['paymentInformation']['city'],
                            "province"=> $params['paymentInformation']['province'],
                            "postalCode"=> $params['paymentInformation']['postal'],
                            "country" => $params['paymentInformation']['country']
                        ]
                    ],
                    "userIp"=> $this->ip,
                    "userAgent" => $_SERVER['HTTP_USER_AGENT']
                ]
            ]
        ];
        $roomPaxCount = 0;
        foreach ($params['passengerInformation'] as $i => $pax) {
            if (isset($pax['isPrimary']) && $pax['isPrimary']) {
                $data['bookRQ']['inputs']['contact']['email'] = $pax['email'];
                $data['affiliate']['bookingEmail'] = $pax['email'];
                $data['bookRQ']['inputs']['contact']['dayTimePhone'] = $pax['phone'];
            }
            $passenger = [
                "title" => $pax['title'],
                "firstName" => $pax['first'],
                "lastName" => $pax['last'],
                "middleName" => $pax['middle'],
                "dob" => $pax['year'].'-'.$pax['month'].'-'.$pax['day'],
            ];

            if(!empty($pax['age'])) {
                $passenger["age"] = intval($pax['age']);
            }

            $data['bookRQ']['inputs']['passengers'][] = $passenger;
        }

        try{
            $bookDevTest = env('BOOK_DEV_TEST',0);
            if($bookDevTest){
                 $respData = json_decode('{"data":{"session":{"id":"DHL5ddd88004e2538.823586101574799360dyn"},"cartResult":{"bookingInfo":{"confirmationNumber":"64862560","bookingStatus":"Confirmed","bookingDate":"2019-11-26 15:31:51","vendor":"P","check_in":"2014-06-20","check_out":"2014-06-22"},"roomInfo":{"totalAdults":2,"totalChildren":0,"totalNights":2,"description":"1 King Bed - Nonsmoking Room","numberOfRoomsBooked":1,"rooms":[{"confirmationNumber":"","numberOfAdults":"","numberOfChildren":"","firstName":"","lastName":"","bedTypeDescription":"","smokingPreference":""}]},"passengerInfo":[{"title":"","firstName":"Fresh","lastName":"Prince"}],"contactInfo":{"email":"fresh@bel-air-academy.com","primaryPhoneAreaCode":"555","primaryPhone":"555-5555"},"paymentInfo":{"ccNumber":"XXXX-XXXX-XXXX-1111","ccType":"VI","ccExpiry":"2022-12","ccAddress":{"street":"805 Saint Cloud Road","city":"Los Angeles","province":"CA","postalCode":"90049","country":"US"},"cardHolder":"Albertz Perryz"},"products":{"hotel":{"hotelDetails":{"hotel_id":"700076471","name":"Holiday Inn Winnipeg-South","star_rating":3,"reviewRatingDesc":"Very Good","city":"Winnipeg"},"extras":{"amenities":[{"id":"2","name":"Business Center"},{"id":"92","name":"Free Internet In Room"},{"id":"9","name":"Fitness Center or Spa"},{"id":"10","name":"Free Parking"},{"id":"13","name":"Pets Allowed"},{"id":"93","name":"Indoor Swimming Pool"}],"important_information":["Reservations cannot be refunded or changed. Full payment is required upon booking.","Your reservation will be confirmed in a 3 star or higher hotel in your selected area and may not be one that you saw during a previous search. Only Amenities listed above are guaranteed.","The reservation holder must be 21 years of age or older and must present a valid photo ID and credit card at check-in.  The hotel may charge you for mandatory (e.g. resort) fees or incidentals (e.g. parking). These charges are not included in your reservation price.","All rooms accommodate two guests. Special needs, bed type or other requests are at the discretion of the confirmed hotel. Please contact the hotel directly for availability."]}}}}}}', true);
                // $respData = json_decode('{"error": {"code": "sdfs", "message": "thi sis a error"}}', true);
                 $return = isset($respData['data']) ? $respData['data']['cartResult'] : $respData;
            } else {
                $this->init($this->_baseHotelApiUrl);
                $response = $this->_apiClient->request('POST', "book", [
                    "query" => [
                        'q' => json_encode($data)
                    ]
                ]);
                if ($response->getstatusCode() == 200) {
                    $respData = json_decode($response->getBody(), true);
                    $return = isset($respData['data']) ? $respData['data']['cartResult'] : $respData;
                } else {
                    // error handling
                    $return = $this->_generateErrorRenponse("T301", "Connection Problem");
                }
            }
        } catch (GuzzleException $e) {
            // handle error
            $return = $this->_generateErrorRenponse("T301", "Connection Problem");
        }

        $data['bookRQ']['inputs']['payment']['ccNumber'] = substr_replace($data['bookRQ']['inputs']['payment']['ccNumber'], '***********', 3, -2);
        return [json_encode($data), $return];
    }

    private function _generateErrorPendingResponse() {
        return [
            "confirmationNumber" => "PENDING",
            "bookingStatus" => "PENDING",
            "bookingDate" => date('Y-m-d H:i:s'),//"2018-02-15 01:39:14",
            "vendor" => "SABRE"
        ];
    }

    private function _generateErrorRenponse($code, $message) {
        return [
            'error' => [
                'code' => $code,
                'message' => $message
            ]
        ];
    }

    public function getSelectedResult($params) {
        $result = false;

        $roomData = Cache::get("htl-room-$params[hotelId]:$params[sessionID]");

        if(!empty($roomData)) {
            $result = [];

            $result['sessionId'] = $params['sessionID'];
            $result['resultId'] = $params['resultsID'];
            $result['roomIndex'] = $params['roomIndex'];
            $result['roomRate'] = $params['rate'];
            $result['roomResult'] = $roomData['data']['roomResults']['rows'][$params['roomIndex']];
            $result['image'] = isset($roomData['data']['hotelDetails']['hotelImages'][0]['url']) ? $roomData['data']['hotelDetails']['hotelImages'][0]['url'] : '';

            unset($roomData['data']['hotelDetails']['reviews']);
            unset($roomData['data']['hotelDetails']['hotelImages']);
            unset($roomData['data']['hotelDetails']['propertyAmenities']);

            $result = array_merge($result, $roomData['data']['hotelDetails']);
        }

        return $result;
    }

    public function getSearchData($sessionID) {
        $data = Cache::get('htl-translated-'.$sessionID);
        return $data;
    }
}
