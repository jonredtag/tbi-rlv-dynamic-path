<?php
namespace App\Repositories\Concrete;

use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\GuzzleException;

class CouponRepository {

    function __construct() {
        $this->_apiClient = new Guzzle(
            [
                // 'headers' => [
                    // 'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                // ],
                'base_uri' => config('api.promo'),
            ]
        );

    }

    public function checkCode($params)
    {
        $couponCode = strtoupper($params['couponCode']);
        if (in_array($couponCode, ['CBF25', 'CBF50', 'CBF150', 'CCM50', 'CCM150', 'CCM250'])) {
            $amount = 0;

            $today = date('Y-m-d');
            if ($couponCode === 'CBF25' && $params['costPer'] >= 300 && $today >= '2021-11-22' && $today <= '2021-11-28') {
                $amount = 25;
            } else if ($couponCode === 'CBF50' && $params['costPer'] >= 900 && $today >= '2021-11-22' && $today <= '2021-11-28') {
                $amount = 50;
            } else if ($couponCode === 'CBF150' && $params['costPer'] >= 1600 && $today >= '2021-11-22' && $today <= '2021-11-28') {
                $amount = 150;
            } else if ($couponCode === 'CCM50' && $params['costPer'] >= 599 && $today == '2021-11-29') {
                $amount = 50;
            } else if ($couponCode === 'CCM150' && $params['costPer'] >= 1700 && $today == '2021-11-29') {
                $amount = 150;
            } else if ($couponCode === 'CCM250' && $params['costPer'] >= 2500 && $today == '2021-11-29') {
                $amount = 250;
            } else {
                return [
                    "error" => [
                        "message" => "Coupon is not valid for this purchase",
                    ]
                ];
            }

            return [
                "coupon" => [
                    "code" => $couponCode,
                    "value" => $amount,
                ],
            ];
        }

        $params['product'] = 2;
        $query = '{"checkRQ":{"inputs":{"code":"'.$params['couponCode'].'","product":'.$params['product'].',"validate":'.$params['validate'].',"cost":'.$params['cost'].'}}}';

        $response = $this->_apiClient->request('GET', "checkCode", [
            "query" => [
                'request' => $query
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        return $data['data'];
    }

    public function claimCode($params)
    {
        if (in_array($params['couponCode'], ['CBF25', 'CBF50', 'CBF150', 'CCM50', 'CCM150', 'CCM250'])) {
            return [
                "coupon" => [
                    "status" => "success",
                ]
            ];
        }

        $product = $params['product'] === 'H' ? 1 : 2;
        $query = '{"claimRQ":{"inputs":{"code":"'.$params['couponCode'].'","bookingNumber":"'.$params['bookingNumber'].'","product":'.$product.'}}}';

        $response = $this->_apiClient->request('POST', "claimCode", [
            "query" => [
                'request' => $query
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        return $data['data'];
    }
}
