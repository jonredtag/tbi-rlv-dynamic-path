<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\PaymentInterface;
use App\Repositories\Abstracts\PaymentAbstract;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;

class AdyenPaymentRepository extends PaymentAbstract implements PaymentInterface {

    private $serviceID;
    private $apiClient;

    function __construct($config) {
        $this->apiClient = new \Adyen\Client();
        $this->apiClient->setEnvironment(\Adyen\Environment::TEST);
        $this->apiClient->setUsername("ws_200289@Company.HISHOLDINGS");
        $this->apiClient->setPassword("9t7q>IEBj(E\$_QFrH-Q{}7?>y");

        $this->apiClient->setXApiKey("AQEthmfxLYrOaR1Lw0m/n3Q5qf3VYKJ+JbxmfEx44Us48OJOY9EWYXtkMdN3Dd9UEMFdWw2+5HzctViMSCJMYAc=-i/tIbDqWGpwzT3rOQNwLm2H/pfd4B47JIeFJc9bH4Vo=-6LtFsajaZh6.mR+u");

    }

    public function authorize($data)
    {
        $params = [
            "paymentMethod" => array(
                "type" => "scheme",
                // "encryptedCardNumber" => "test_370000000000002",
                // "encryptedExpiryMonth" => "test_03",
                // "encryptedExpiryYear" => "test_2030",
                // "encryptedSecurityCode" => "test_7373"
                "number" => $data['ccnum'],
                "expiryMonth" => $data['expiry']['month'],
                "expiryYear" => $data['expiry']['year'],
                "holderName" => $data['ccName'],
                "cvc" => $data['cvc']
            ),
            "amount" => array(
                "currency" => $data['currency'],
                "value" => intval(floatval($data['amount'])*100)
            ),
            "reference" => "RLV-".$data['bookingnum'],
            "merchantAccount" => "TBI_adyen_test",
            "additionalData" => [
                "authorisationType" => "PreAuth"
            ]
        ];
        // dd($params);
        try {
            $client = new \Adyen\Service\Checkout($this->apiClient);
            $result = $client->payments($params);
        } catch (\Exception $e) {
            $result = [
                "error" => [
                    "message" => $e->getMessage(),
                    "code" => "P01",
                ]
            ];
        }
        
        $params['paymentMethod']['number'] = substr_replace($params['paymentMethod']['number'], '***********', 3, -2);
        $params['paymentMethod']['cvc'] = '***';
        $this->logTransaction(__FUNCTION__, $params, json_encode($result), $data['bookingnum']);


        $parsedData = [
            "success" => (isset($result['resultCode']) && $result['resultCode'] === 'Authorised' ? true : false),
            "transactionID" => (string)($result['pspReference'] ?? ''),
        ];

        return $parsedData;
    }

    public function capture($data)
    {
        $params = [
            "merchantAccount" => "TBI_adyen_test",
            "modificationAmount" => array(
                "currency" => $data['currency'],
                "value" => intval(floatval($data['amount'])*100),
            ),
            "originalReference" => $data['transid'],
            "reference" => $data['bookingnum']
        ];

        try {
            $modification = new \Adyen\Service\Modification($this->apiClient);
            $result = $modification->capture($params);
        } catch (\Exception $e) {
            $result = [
                "error" => [
                    "message" => $e->getMessage(),
                    "code" => "P02",
                ]
            ];
        }

        $this->logTransaction(__FUNCTION__, $params, json_encode($result), $data['bookingnum']);

        $parsedData = [
            "success" => (empty($result['error']) ? true : false),
            "transactionID" => (string)($result['pspReference'] ?? ''),
        ];

        return $parsedData;
    }

    public function cancel($data)
    {
        $params = [
            "merchantAccount" => "TBI_adyen_test",
            "originalReference" => $data['transid'],
            "reference" => $data['bookingnum']
        ];

        try {
            $modification = new \Adyen\Service\Modification($this->apiClient);
            $result = $modification->cancel($params);
        } catch (\Exception $e) {
            $result = [
                "error" => [
                    "message" => $e->getMessage(),
                    "code" => "P02",
                ]
            ];
        }

        $this->logTransaction(__FUNCTION__, $params, json_encode($result), $data['bookingnum']);

        $parsedData = [
            "success" => (empty($result['error']) ? true : false),
            "transactionID" => (string)($result['pspReference'] ?? ''),
        ];

        return $parsedData;
    }
}
