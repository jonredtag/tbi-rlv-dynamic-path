<?php
namespace App\Repositories\Concrete;
use App\Repositories\Abstracts\PaymentAbstract;

class VirtualCardRepository extends PaymentAbstract {
    protected $vccClient;

    function __construct($config) {
        if(!empty($config['vccUrl'])){
            $options = [
                'cache_wsdl' => 0,
                'trace' => 1,
                'stream_context' => stream_context_create(
                        [
                            'ssl' => [
                                'verify_peer' => false,
                                'verify_peer_name' => false,
                                'allow_self_signed' => true
                            ]
                        ]
                )
            ];
            $this->vccClient = new \SoapClient($config['vccUrl'], $options);
        }
    }

    public function getVirtualCard($requestData){
        try {
                $param = '<?xml version="1.0" encoding="utf-8"?>
                <XML>
                    <BOOKING_REFERENCE>'.$requestData['bookingRef'].'</BOOKING_REFERENCE>
                    <CLIENT_NAME>'.$requestData['clientName'].'</CLIENT_NAME>
                    <CURR>USD</CURR>
                    <DEPARTURE_DATE>'.$requestData['deptDate'].'</DEPARTURE_DATE>
                    <EXPIRATION_DATE>'.$requestData['retDate'].'</EXPIRATION_DATE>
                    <DURATION>'.$requestData['duration'].'</DURATION>
                    <BOOKING_NUMBER>'.$requestData['bookingNo'].'</BOOKING_NUMBER>
                    <TOTAL_PAYMENT_AMOUNT>'.$requestData['amount'].'</TOTAL_PAYMENT_AMOUNT>
                    <INVOICES>
                        <INVOICE>
                            <INVOICE_NUMBER>'.$requestData['invoiceNo'].'</INVOICE_NUMBER>
                            <INVOICE_DATE>'.$requestData['invoiceDate'].'</INVOICE_DATE>
                            <INVOICE_AMOUNT>'.$requestData['amount'].'</INVOICE_AMOUNT>
                        </INVOICE>
                    </INVOICES>
                </XML>';

                $req = array(
                    'inboundRequest'=>$param,
                );
                $webService = $this->vccClient->GetVirtualCard($req);
                $returnInfo = simplexml_load_string((String) $webService->GetVirtualCardResult);

                $logResponse = $returnInfo;
                if((String)$returnInfo->STATUS =='OK'){
                    $response = [
                        'status'=>'ok',
                        'merchantId'=>(String)$returnInfo->MERCHANT_LOG_UNIQUE_ID,
                        'cardInfo'=>array(
                            'cardType'=>'MC',
                            'number'=>(String)$returnInfo->VCC_NO,
                            'cvv'=>(String)$returnInfo->CVV,
                            'expiredDate'=>(String)$returnInfo->EXP_DATE,
                        ),
                    ];
                    $logResponse = $response;
                    $logResponse['cardInfo']['number'] = substr_replace($logResponse['cardInfo']['number'], '***********', 3, -2);
                } else {
                    $response = ["error" => ["code" => "T500", "message" => "Return Infor Error"]];
                }
                $this->logTransaction(__FUNCTION__, $param, $logResponse, $requestData['bookingRef']);

                return $response;
        } catch (\Exception $e) {
            return $this->_generateErrorRenponse("T301", $e->getMessage());
        }
    }

    public function cancelVirtualCard($merchantId){
        try {
               $req = array(
                 'inboundRequest'=>$merchantId,
               );
                $webService = $this->vccClient->CancelMerchantLog($req);
                $returnInfo = simplexml_load_string((String) $webService->CancelMerchantLogResult);
                if((String)$returnInfo->STATUS =='OK'){
                    return true;
                } else {
                     return $this->_generateErrorRenponse("T500", "Return Infor Error");
                }
        } catch (\Exception $e) {
            return $this->_generateErrorRenponse("T301", $e->getMessage());
        }
    }

    private function _generateErrorRenponse($code, $message){
        return  ["error" => ["message" => $message, "code" => $code]];
    }
}
