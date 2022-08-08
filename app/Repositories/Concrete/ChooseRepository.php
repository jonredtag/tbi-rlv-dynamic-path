<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use \Cache;

class ChooseRepository {
    public function __construct() {
        $this->config = config('services.choose');

        $token = Cache::get('choose-token');
        if($token === null) {
            $token = $this->createToken();
            if(empty($token['error'])) {
                Cache::put('choose-token', $token, 1200);
            }
        }

        $this->_apiClient = new Guzzle([
            'base_uri' => $this->config['resource_url'],
            'headers' => [
                'Authorization' => 'Bearer '.$token['access_token'],
            ],
        ]);
    }

    public function getChooseFootprintsAmountToPay($carbonAmount, $numberOfPaxForEachLeg, $currency='USD')
    {
        try {
            $response = $this->_apiClient->request('POST', '/v1/portfolios/co2/default/quote', [
                'query' => [
                    'kilosCo2' => $carbonAmount,
                    'currency' => $currency,
                    'flightSegments' => $numberOfPaxForEachLeg,
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            $structuredResponse = [
                'quoteID' => $data['id'],
                'impact' => "Co2",
                'portfolioId' => $data['items'][0]['portfolioId'],
                'kilosCo2' => $data['totalKilosCo2'],
                'price' => $data['totalPrice'],
                // 'feeFactors' => [
                //     'flightPax' => $data['items'][0]['feeFactors']['flightSegments'],
                // ],
                'currency' => $data['currency'],
            ];
        } catch (GuzzleException $e) {
            $structuredResponse = ['error' => ['message' => 'Error communicating with supplier.']];
        }

        return $structuredResponse;
    }

    public function getChooseFootprintsByFlightSegment($flightSegments, $travelClassCode='Y', $noOfPax=1) 
    {
        try {
            $response = $this->_apiClient->request('POST', '/v1/footprint/flights/', [
                'query' => [
                    'travelClassCode' => $travelClassCode,
                    'passengers' => $noOfPax,
                ],
                'body' => json_encode($flightSegments),
            ]);

            // return $response;
            $data = json_decode($response->getBody(), true);

            $totalFootprintAmount = 0;
            if(is_array($data)) {
                foreach($data as $eachFootprint) {
                    if($eachFootprint['status'] == 200) {
                        if(!empty($eachFootprint['response']['KilosCo2e'])) {
                            $totalFootprintAmount+=$eachFootprint['response']['KilosCo2e'];
                        } else {
                            $totalFootprintAmount+=$eachFootprint['response']['KilosCo2'];
                        }
                    }
                }
            }
        } catch(GuzzleException $e) {
            $totalFootprintAmount = 0;
        }

        return $totalFootprintAmount;
    }

    public function getChooseFootprintsByHotel($nights, $rooms=1){
        try {
            $response = $this->_apiClient->request('GET', '/v1/footprint/hotels/usa', [
                'query' => [
                    'days' => $nights,
                    'rooms' => $rooms,
                ]
            ]);

            // return $response;
            $data = json_decode($response->getBody(), true);

            $totalFootprintAmount = 0;
            if(($data)) {
               
                
                if(!empty($data['kilosCo2e'])) {
                    $totalFootprintAmount+=$data['kilosCo2e'];
                } else {
                    $totalFootprintAmount+=$data['KilosCo2'];
                }
                   
                
            }
        } catch(GuzzleException $e) {
            $totalFootprintAmount = 0;
        }

        return $totalFootprintAmount;
    }

    public function createStripePayment($customerData)
    {
        try {
            $param = [
                'type' => 'card',
                'card' => [
                    'number' => $customerData['number'],
                    'exp_month' => $customerData['expiryMonth'],
                    'exp_year' => $customerData['expiryYear'],
                    'cvc' => $customerData['cvv'],
                ],
            ];

            $client = new Guzzle();
            $response = $client->request('POST', $this->config['stripe_url'].'v1/payment_methods', [
                'headers' => [
                    "Authorization" => "Bearer " . $this->config['stripe_api_key'],
                ],
                'form_params' => $param,
            ]);

            if($response->getStatusCode() == '200') {
                $data = json_decode($response->getBody(), true);

                return (isset($data['id']) && !empty($data['id']) ? $data['id'] : null);
            }
        } catch (GuzzleException $e) {
        }
        return null;
    }

    public function createOrderThroughStripe($request)
    {
        try {
            $response = $this->_apiClient->request('POST', $this->config['resource_url'].'/v1/orders', [
                'body' => json_encode($request),
            ]);

            $data = json_decode($response->getBody(), true);

            if ($data['stripe']['status'] == 'succeeded') {
                $structuredResponse = array();
                $structuredResponse['orderId'] = $data['orderId'];
                $structuredResponse['billId'] = $data['billId'];
                $structuredResponse['customerId'] = $data['customerId'];

                return $structuredResponse;
            }
        } catch (GuzzleException $e) {
            dd($e->getMessage());
        }

        return ['error' => ['message' => 'Create order not success']];
    }

    private function createToken()
    {
        $client = new Guzzle();
        $response = $client->request('POST', $this->config['create_token_url'], [
            'headers' => [
                'Content-type' => 'application/x-www-form-urlencoded;charset=UTF-8',
            ],
            "form_params" => [
                'grant_type' => 'client_credentials',
                'client_id' => $this->config['clientID'],
                'client_secret' => $this->config['clientsecret'],
                'resource' => $this->config['resource_url'],
            ],
        ]);

        $data = json_decode($response->getBody(), true);


        if (!empty($data)) {
            if (!isset($data['error'])) {
                return $data;
            }
        }

        return ['error' => ['message' => 'Token could not be generated']];
    }

}
