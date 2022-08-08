<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\PaymentInterface;
use App\Repositories\Abstracts\PaymentAbstract;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;

class MonerisPaymentRepository extends PaymentAbstract implements PaymentInterface {

    private $serviceID;
    private $apiClient;

    function __construct($config) {
        $this->serviceID = $config['serviceid'];
        $this->apiClient = new Guzzle(
            [
                'base_uri' => $config['url'],
            ]
        );
    }

    public function authorize($data)
    {
        $time = date("Hi");
        $bookingnum = $data['bookingnum'];
        $data['ttsquoteid'] = $time . '-' . $bookingnum;
        $data['bookingnum'] = "B" . $time . '-' . $bookingnum;
        $data['currtype'] = $data['currency'];
        $data['preauth'] = '1';
        $data['expdate'] = substr($data['expiry']['year'],-2,2).$data['expiry']['month'];
        $data['cvdvalue'] = $data['cvc'];
        $data['cvdindicator'] = 1;
        $data['avs'] = 0;
        $data['cvd'] = 1;
        unset($data['expiry']);
        unset($data['ccName']);
        unset($data['cvc']);
        // dd($data);
        $response = $this->request($data);

        $data['ccnum'] = substr_replace($data['ccnum'], '***********', 3, -2);
        $data['cvdvalue'] = '***';
        $this->logTransaction(__FUNCTION__, $data, $response, $bookingnum);

        if(empty((String)$response->ERROR)) {
            $parsedData = [
                "success" => ((string)$response->PREAUTH->RESPONSE_CODE === '00' ? true : false),
                "transactionID" => (string)$response->PREAUTH->TRANSACTION_ID,
            ];
        } else {
            $parsedData = [
                "success" => false,
            ];
        }

        return $parsedData;
    }

    public function capture($data)
    {
        $time = date("Hi");
        $bookingnum = $data['bookingnum'];
        $data['ttsquoteid'] = $time . '-' . $bookingnum;
        $data['bookingnum'] = "B" . $time . '-' . $bookingnum;
        $data['currtype'] = $data['currency'];
        $data['capture'] = '1';

        unset($data['expiry']);
        unset($data['ccName']);
        unset($data['cvc']);

        $response = $this->request($data);

        $this->logTransaction(__FUNCTION__, $data, $response, $bookingnum);

        if(empty((String)$response->ERROR)) {
            $parsedData = [
                "success" => ((string)$response->CAPTURE->RESPONSE_CODE === '00' ? true : false),
                "transactionID" => (string)$response->CAPTURE->TRANSACTION_ID,
            ];

            // $parsedData = [
            //     "success" => true,
            //     "transactionID" => 524856195,
            // ];
        } else {
            $parsedData = [
                "success" => false,
            ];
        }

        return $parsedData;
    }

    public function cancel($data)
    {
        $time = date("Hi");
        $bookingnum = $data['bookingnum'];
        $data['ttsquoteid'] = $time . '-' . $bookingnum;
        $data['bookingnum'] = "B" . $time . '-' . $bookingnum;
        $data['currtype'] = $data['currency'];
        $data['capture'] = '1';
        $data['amount'] = '0.00';

        unset($data['expiry']);
        unset($data['ccName']);
        unset($data['cvc']);

        $response = $this->request($data);

        $this->logTransaction(__FUNCTION__, $data, $response, $bookingnum);

        if(empty((String)$response->ERROR)) {
            $parsedData = [
                "success" => ((string)$response->CAPTURE->RESPONSE_CODE === '00' ? true : false),
                "transactionID" => (string)$response->CAPTURE->TRANSACTION_ID,
            ];

            // $parsedData = [
            //     "success" => true,
            //     "transactionID" => 524856195,
            // ];
        } else {
            $parsedData = [
                "success" => false,
            ];
        }

        return $parsedData;
    }

    private function request($requestData) {
        $requestData['serviceid'] = $this->serviceID;
        try {
            $bookDevTest = env('BOOK_DEV_TEST',0);
            if ($bookDevTest) {
                //For testing
                $results = '<?xml version="1.0" encoding="utf-8"?>
                    <TRANSACTION>
                        <PREAUTH>
                            <ERROR></ERROR>
                            <ORDERID>111-'.rand().'</ORDERID>
                            <RESPONSE_CODE>00</RESPONSE_CODE>
                            <RESPONSE_DESC>Approved</RESPONSE_DESC>
                            <AUTHORIZATION_CODE>222-'.rand().'</AUTHORIZATION_CODE>
                            <TRANSACTION_ID>333-'.rand().'</TRANSACTION_ID>
                            <REFERENCE_NUM>444-'.rand().'</REFERENCE_NUM>
                        </PREAUTH>
                        <CAPTURE>
                            <ERROR></ERROR>
                            <ORDERID>111-'.rand().'</ORDERID>
                            <RESPONSE_CODE>00</RESPONSE_CODE>
                            <RESPONSE_DESC>Approved</RESPONSE_DESC>
                            <AUTHORIZATION_CODE>222-'.rand().'</AUTHORIZATION_CODE>
                            <TRANSACTION_ID>333-'.rand().'</TRANSACTION_ID>
                            <REFERENCE_NUM>444-'.rand().'</REFERENCE_NUM>
                        </CAPTURE>
                    </TRANSACTION>';
            } else {
                $response = $this->apiClient->request('POST', '', [
                    "form_params" => [
                        'postData' => urlencode(http_build_query($requestData))
                    ]
                ]);
                if ($response->getstatusCode() == 200){
                    if ($response->getBody()) {
                        $results =  $response->getBody()->read(1024);
                    } else {
                        return $this->_generateErrorRenponse("T301", "Bad Response");
                    }
                } else {
                   // error handling
                    return $this->_generateErrorRenponse("T302", "Bad response code");
                }
            }
            libxml_use_internal_errors(true);
            $doc = simplexml_load_string($results);
            if (!$doc) {
                libxml_clear_errors();
                return $this->_generateErrorRenponse("T401", "Bad XML");
            } else {
                return $doc;
            }
        } catch (GuzzleException $e){
            // handle error
            return $this->_generateErrorRenponse("T501", $e->getMessage());
        }
    }

    private function _generateErrorRenponse($code, $message){
        $xml = "<?xml version='1.0' encoding='UTF-8' ?><ROOT><ERROR>$message</ERROR><ERROR_CODE>$code</ERROR_CODE></ROOT>";
        return simplexml_load_string($xml);
    }
}
