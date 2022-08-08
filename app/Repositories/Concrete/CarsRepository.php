<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\APIInterface;
use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Promise;
use GuzzleHttp\Exception\GuzzleException;

class CarsRepository  implements APIInterface{
    protected $_apiClient;
    private $_baseHotelApiUrl;

    function __construct() {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
            ]
        );
    }

    public function search($params)
    {

    }

    public function paginate($params)
    {

    }

    public function filter($params)
    {

    }

    public function sort($params)
    {

    }

    public function details($params)
    {
        $query = [
            "detailsRQ" => [
                "inputs" => $params['inputs'],
                "version" => "v1"
            ],
            "session" => [
                "id" => $params['sessionID'],
                "lan" => \App::getLocale()
            ]
        ];

        $response = $this->_apiClient->request('post', config('api.car').'details', [
            "body" => json_encode($query),
        ]);

        $data = json_decode($response->getBody(), true);

        unset($data['search']);
        $data['rateIndex'] = $params['rateIndex'];
        $data['session'] = [
            "id" => $params['sessionID'],
            "lan" => \App::getLocale()
        ];
        return $data;
    }

    public function getTerms($sid, $params)
    {
        $query = '{
            "redbookRQ": {
                "inputs": {
                    "resultId": '. $params['resultId'] .'
                },
                "version": "v1"
            },
            "session": {
                "lan": "'.\App::getLocale().'",
                "id": "'.$sid.'"
            }
        }';

        $promises['redbook'] = $this->_apiClient->requestAsync('post', config('api.car').'redbook', [
            "body" => $query,
        ]);
        $query = '{
            "termsRQ": {
                "inputs": {
                    "resultId": '. $params['resultId'] .',
                    "inclusive": "'.($params['inclusive'] === 'false' ? 'N' : 'Y').'"
                },
                "version": "v1"
            },
            "session": {
                "lan": "'.\App::getLocale().'",
                "id": "'.$sid.'"
            }
        }';

        $promises['terms'] = $this->_apiClient->requestAsync('post', config('api.car').'terms', [
            "body" => $query,
        ]);

        $results = Promise\settle($promises)->wait();

        try {
            foreach ($results as $key => $response) {
                $responses[$key] = json_decode($response['value']->getBody(), true);
            }


        }catch (Exception $e) {

        }

        return $responses;
    }

    public function verify($params) {
        $query = '{
            "verifyRQ": {
                "inputs": {
                    "checkout": "'.$params['code'].'",
                    "rate": '.$params['rateIndex'].'
                },
                "version": "v1"
            },
            "session": {
                "lan": "'.\App::getLocale().'",
                "id": "'.$params['sessionId'].'"
            }
        }';

        $response = $this->_apiClient->request('post', config('api.car').'verify', [
            "body" => $query,
        ]);

        $data = json_decode($response->getBody(), true);
        return $data;
    }

    public function book($params)
    {
        $expiry = explode('/', $params['paymentInformation']['expiry']);
        $query = [
            "bookRQ" => [
                "inputs" => [
                    "passengers" => [
                        [
                            "title" => $params['passengerInformation'][0]['title'],
                            "firstName" => $params['passengerInformation'][0]['first'],
                            "lastName" => $params['passengerInformation'][0]['last'],
                            "middleName" => $params['passengerInformation'][0]['middle'],
                            "age" => 29,
                        ]
                    ],
                    "payment" => [
                        "cardHolder" => $params['paymentInformation']['holder'],
                        "ccNumber" => str_replace('-', '', $params['paymentInformation']['card']),
                        "ccMonth" => $expiry[1],
                        "ccYear" => $expiry[0],
                        "ccCVC" => $params['paymentInformation']['security'],
                        "ccAddress" => [
                            "street" => $params['paymentInformation']['address'],
                            "city" => $params['paymentInformation']['city'],
                            "postal" => $params['paymentInformation']['postal'],
                            "country" => $params['paymentInformation']['country'],
                            "province" => $params['paymentInformation']['province'],
                        ],
                    ],
                    "contact" => [
                        "phone" => $params['passengerInformation'][0]['phone'],
                        "email" => $params['passengerInformation'][0]['email'],
                    ],
                    "rate" => $params['rateIndex'],
                    "specialRequest" => '',
                    "dropfee" => $params['dropfee'],
                    "petro" => null,
                    "coupon" => '',
                ],
                "version" => 'v1',
            ],
            "session" => [
                "checkout" => $params['checkout'],
                "upSellCode" => '',
                "dynamic" => true,
                "id" => $params['sessionId'],
                "lan" => \App::getLocale(),
            ],
        ];

        try{
            $bookDevTest = env('BOOK_DEV_TEST',0);
            if($bookDevTest){
                $responseData = '{"session":{"id":"TR60958c564cfa87.39434837","checkout":"DT60958c5ee16c99.41494664"},"cartResult":{"bookingInfo":{"car":{"bookingStatus":"Success","errorMessage":"","reservationNumber":"55460683","confirmationNumber":"J7553504251","tbi":{"TTS":"55460683","Payment":""},"voucher":"980276","dropoffTelephone":"702 739 9507","pickupTelephone":"702 739 9507","pickupDate":"12\/20\/2021 20:50","dropoffDate":"12\/22\/2021 23:59","pickupAddress":"DESK IN TERMINAL,LAS VEGAS, NV","pickupLocation":"LAS VEGAS MCCARRAN INT\'L APT","dropoffAddress":"DESK IN TERMINAL,LAS VEGAS, NV","dropoffLocation":"LAS VEGAS MCCARRAN INT\'L APT","bookingDate":"2021-05-07 14:55:38","vendor":"ae","ccCharged":true,"pickupFax":"N\/A","dropoffFax":"N\/A","rateQualifier":"PREPAID","rate":{"name":"Basic","description":"Basic Rate","total":238.79,"included":["Liability Insurance","Fire Insurance"],"excluded":["Collision Damage Waiver (CDW)","Theft Protection (TP)"],"inclusive":false,"price":119,"tax":10,"priceChanged":false,"pricePrecise":119.4},"upSellCode":""}},"passengerInfo":{"passengerType":"ADT","age":29,"sequenceNumber":"1","dob":"","firstName":"Albertz ","lastName":"Perryz","middleName":"","title":"Mr"},"contactInfo":{"dayTimePhone":"555-555-5555","email":"albert@redtag.ca","eveningPhone":""},"paymentInfo":{"cardHolder":"Albertz Perryz","ccCVC":"000","ccExpiry":"12-2021","ccNumberEncrypted":"","ccNumber":"411111XXXXXX1111","ccType":"VI","paymentStatus":"Success","ccAddress":{"city":"Mississauga","country":"CA","postalCode":"L4W5N1","province":"ON","street":"5450 Explorer Dr"}},"products":{"car":{"rentalInfo":{"duration":2,"included":[],"notIncluded":[],"sipp":"ECAR","puLocId":15805,"doLocId":15805,"vendorId":"DLR","name":"Chevrolet Spark","passengers":"4","luggage":"7cuft","doors":"2","rateQualifier":"PREPAID","class":"Economy","size":"2\/4 Door","transmission":"Auto Unspecified Drive","fuel":"Unspecified Fuel\/Power With Air","api":"ae","image":"http\/\/www.globalmediaserver.com\/images\/cars\/ChevroletSpark_2.jpg","rid":0},"rateInfo":{"name":"Basic","description":"Basic Rate","total":238.79,"included":["Liability Insurance","Fire Insurance"],"excluded":["Collision Damage Waiver (CDW)","Theft Protection (TP)"],"inclusive":false,"price":119,"tax":10,"priceChanged":false,"pricePrecise":119.4,"amount":238.79},"extras":{"locations":{"15805":{"code":15805,"group":"1","row":{"LocID":"15805","LocationGroup":"3","LocationType":"a","OperatorName":"DOLLAR","OperatorCode":"DLR","CityID":"3048","CountryCode":"US","Ad1":"LAS VEGAS MCCARRAN INT\'L APT","Ad2":"DESK IN TERMINAL","Ad3":"LAS VEGAS, NV","Ad4":"","OnAirport":"Y","Terminal":"","IATA":"LAS","Lat":"36.084899","Lng":"-115.151153","updated":"2020-03-20 11:44:12","CountryName":"United States","CityName":"LAS VEGAS"},"vendor":{"code":"DLR","name":"DOLLAR"},"name":"Las Vegas Mccarran Int\'l Apt","atAirport":"Y","address":"Desk In Terminal","iata":"LAS"}},"vendors":{"DLR":{"code":"DLR","division":"DOLLAR","logo":"https:\/\/travel-img-assets.s3-us-west-2.amazonaws.com\/cars\/vendors\/dollar.jpg"}}}}},"id":"TR60958c564cfa87.39434837"},"UpSellCode":""}';
            } else {
                $response = $this->_apiClient->request('post', config('api.car').'book', [
                    "body" => json_encode($query),
                ]);
                if($response->getstatusCode() == 200) {
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


        return [json_encode($query), $responseData];
    }

    public function getSelectedResult($params) {

    }
}
