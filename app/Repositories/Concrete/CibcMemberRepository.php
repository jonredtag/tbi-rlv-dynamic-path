<?php

namespace App\Repositories\Concrete;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use App\Helper\Helpers;

class CibcMemberRepository  {
    private $config;
   

    function __construct($config) {
        $this->config = $config;
        $this->apiClient = new Guzzle(
            [
                'base_uri' => $config['url'],
            ]
        );
    }
    
    public function tokenProcess($reqdata, $type){
          $resp = null;
          switch($type){
               case 'check_login':
                   if(isset($reqdata['skey'])){
                        $resp = $reqdata['skey'];
                   }
                   $resp = '123';
                  break;
             
              case 'get_member_info':
                   $resp = $this->_getMemberInfo($reqdata);
                  break;
          }
          return $resp;
      }
      
      private function _getMemberInfo($skey){
           /*
           $ssoData = Helpers::cacheGet($skey);  
           $data = json_decode($ssoData,true);
          */          
           $data =  json_decode('{"PREFERRED_FIRST_NAME":"BGLOVE","PREFERRED_LAST_NAME":"BBGOG","PREFERRED_EMAIL":"SAMANTHA.ALINO@CIBC.COM","HOME_PHONE":"4165862186","HOME_ADDRESS":"750 LAWRENCE AVE W","HOME_ADDRESS_2":"W5 6006","CITY":"TORONTO","PROVINCE":"ON","POSTAL_CODE":"M6A1B8","PRODUCT_USED_TO_REDEEM":"PRODAVEINFINITEVISA","REDEEMER_ID":"2bbb664e-2b3f-4f8f-af2a-e2ee130d9ff0","SITE":"FLEX","POINTS":"150000","search":"true","fake_param_":" 00000000000000000000000000000000000000000000000000000000","origin":"https://capri-sit-travel.bondstage.com/en/Cars.aspx","pickupLocation":"TORONTO AIRPORT, CANADA (YYZ)"}', TRUE);
         
            return [ 'status'=>'success', 
                        'points'=>$data['POINTS'],
                        'memberId'=>$data['REDEEMER_ID'],
                        'redeemRatio'=>'0.01',
                        'amount'=> number_format($data['POINTS']*0.01,2,'.',''),
                        'firstName' => $data['PREFERRED_FIRST_NAME'],
	       'lastName' => $data['PREFERRED_LAST_NAME'],
                        'preferEmail'=>$data['PREFERRED_EMAIL'],
                        'address'=>$data['HOME_ADDRESS']. ( !empty($data['HOME_ADDRESS_2'])?",".$data['HOME_ADDRESS_2']:'' ),
                        'city'=>$data['CITY'],
                        'province'=>$data['PROVINCE'],
                        'postal'=>$data['POSTAL_CODE'],
                        'country'=>'CA',
                     ];
    }
     
     
    public function placeOrder($reqData, $orderResponse) {
        $token =  $reqData['token'];
        $postUrl = $this->config['url'].'/place-order';
        $curl = curl_init();
        $payloads = $orderResponse;
        curl_setopt_array($curl, array(
          CURLOPT_URL => $postUrl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_SSL_VERIFYPEER => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $payloads,
          CURLOPT_HTTPHEADER => array(
            'x-token: '.$token
          ),
        ));
        $response = curl_exec($curl);
        $err = curl_errno($curl);
        $errmsg = curl_error($curl);
        $header = curl_getinfo($curl); 
        curl_close($curl);
        if($err) {
            $error_msg = 'Error no:'. $err .', Error:'. $errmsg . $header;
            throw new \Exception($error_msg);
        }
        $resp = json_decode($response, true);
        return $resp;  
    }       
}
