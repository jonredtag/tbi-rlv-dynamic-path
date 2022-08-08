<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class InsuranceRepository{
    protected $_apiClient;

    function __construct() {
        $this->_apiClient = new Client([
            'base_uri' => env('INSURANCE_URL', config('api.insurance')),
        ]);
    }

    public function getQuote($data)
    {
        $departureDate = new \DateTime($data['depDate']);
        $returnDate = new \DateTime($data['retDate']);

        $requestData = [
            "auth" => [
                "branchCode" => "RT500",
                "bookingType" => "Dynamic"
            ],
            "language" => $data['lang'],
            "province" => $data['province'],
            "booking" => [
                "departureCity" => $data['departure']['value'],
                "destinationCity" => $data['destination']['value'],
                "departureDate" => $departureDate->format('Ymd'),
                "returnDate" => $returnDate->format('Ymd'),
            ],
            "passengers" => [
                "passenger" => $data['passengers'],
            ],
        ];

        $request = [
            'body' => json_encode($requestData),
            'timeout' => 60,
        ];

        try {
            $response = $this->_apiClient->request('POST', 'quotes/', $request);
            $data = json_decode($response->getBody(), true);

            if(!isset($data['error'])) {
                $quote = $data['quote'];
                $passengers = $data['quote']['passengers']['passenger'];

                $return = [
                    "quoteID" => $quote['quoteId'],
                    "plans" => [],
                ];
                foreach ($quote['plans'] as $plan) {
                    $plan = [
                        'planCode' => $plan['planCode'],
                        'passengers' => [],
                    ];

                    foreach ($passengers as $index => $passenger) {
                        foreach ($passenger['plans']['plan'] as $passPlan) {
                            if($passPlan['planCode'] === $plan['planCode']){
                                $passenger = [
                                    'id' => $index,
                                    'planPerDay' => $passPlan['planPerDay'],
                                    'planPrice' => $passPlan['planPrice'],
                                    'planTaxes' => $passPlan['planTaxes'],
                                    'planTotal' => $passPlan['planTotal'],
                                ];

                                $plan['passengers'][] = $passenger;
                                $plan['planName'] = $passPlan['planName'];
                                $plan['planURL'] = $passPlan['planURL'];

                                continue 2;
                            }
                        }
                    }
                    $return['plans'][] = $plan;
                }
            } else {
                $return = $data;
            }

            return $return;
        } catch (RequestException $e) {
            $message = $View['Locale']->translateParagraph('insurance-error:1');
            return ["error" => ["message" => substr($message, (strpos($message, '>') + 1))]];
        }
    }

    public function book($data, $plans, $passengers)
    {
        list($month, $year) = explode('/', $data['paymentInformation']['expiry']);
        $requestData = [
            "address" => [
                "city" => $data['paymentInformation']['city'],
                "email" => $data['passengerInformation'][0]['email'],
                "phone" => $data['passengerInformation'][0]['phone'],
                "postal" => $data['paymentInformation']['postal'],
                "province" => $data['insuranceSummary']['province'],
                "street" => $data['paymentInformation']['address']
            ],
            "auth" => [
                "bookingType" => "Dynamic",
                "branchCode" => "RT500",
                "quoteId" => $data['insuranceInformation']['quoteID']
            ],
            "language" => 'en',
            "payment" => [
                "amount" => $data['insuranceSummary']['total'],
                "expiry" => [
                    "month" => $month,
                    "year" => substr($year, -2),
                ],
                "cvv" => $data['paymentInformation']['security'],
                "name" => $data['paymentInformation']['holder'],
                "number" => str_replace('-', '', $data['paymentInformation']['card'])
            ],
            "plans" => $plans,
            "trip" => [
                "origin" => $data['tripInformation']['departure']['value'],
                "destination" => $data['tripInformation']['destination']['value'],
                "departure" => (new \DateTime($data['tripInformation']['depDate']))->format('Ymd'),
                "return" => (new \DateTime($data['tripInformation']['retDate']))->format('Ymd'),
                "passengers" => $passengers,
            ]
        ];

        // echo "<pre>";
        // print_r($requestData);
        // die();

        $request = [
            'body' => json_encode($requestData),
            'timeout' => 60,
        ];

        try {
            $response = $this->_apiClient->request('POST', 'bookings/', $request);
            $booking = json_decode($response->getBody(), true);
            // $booking = json_decode('{"created_at":"2019-11-24T22:31:43Z","id":"2296b448-7f83-4735-a0c1-93ec4a600d0c","number":"RT0097973","policyPlans":{"plan":[{"planCode":"RGCX","planName":"NON-MEDICAL INCLUSIVE","planPrice":"69.00","planTax":"0","planTotal":"69.00","passengers":{"passenger":[{"passengerId":"1","name":"Tester Tester","firstName":"Tester","middleName":"","lastName":"Tester","birthDate":"19890815","price":"69.00","tax":"0","total":"69.00"}]}},{"planCode":"REMU","planName":"EMERGENCY MEDICAL - Under Age 60","planPrice":"13.20","planTax":"0","planTotal":"13.20","passengers":{"passenger":[{"passengerId":"3","name":"Testie Tester","firstName":"Testie","middleName":"","lastName":"Tester","birthDate":"20121101","price":"13.20","tax":"0","total":"13.20"}]}}]},"policyAmount":{"planPrice":"82.20","planTax":"0","planTotal":"82.20","planComm":"36.99"},"authcode":"559564"}', true);
            // $booking = json_decode('{"error": {"code": "sdfs", "message": "thi sis a error"}}', true);
            return $booking;

        } catch (RequestException $e) {
            return ["error" => [ "message" => "Unable to communicate with insurance supplier to complete purchase"]];
        }
    }
}
