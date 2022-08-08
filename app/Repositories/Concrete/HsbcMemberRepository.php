<?php

namespace App\Repositories\Concrete;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;

class HsbcMemberRepository  {
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
          switch($type){
              case 'check_login':
                  
                  
                  
                  $resp =  true;
                  break;
              
              case 'create':
                  $resp = $this->_createToken($reqdata);
                  break;
              
              case 'check':
                  $resp = $this->_checkPoints($reqdata);
                  break;
              
              case 'refresh':
                   $resp = $this->_refreshToken($reqdata);
                  break;
             
              case 'get_member_info':
                   $resp = $this->_getMemberInfo($reqdata);
                  break;
              
              
          }
          return $resp;
      }
      
      private function _createToken($reqdata){
        $reqdata['memberId'] = '824427';  
        $url =  $this->config['url'].'/32/create-token';
        $apiUsername= $this->config['user'];
        $apiPassword= $this->config['pass'];
        $curl = curl_init();
        $setParams['memberId'] = $reqdata['memberId'];      
        $payloads = $setParams;
        /*
        curl_setopt_array($curl, array(
          CURLOPT_URL => $url,
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
                'language: en',
                'Authorization: Basic '. base64_encode("$apiUsername:$apiPassword"),	    
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
        */
        $response = '{ "code": 200, "status": "success","message": "Token created successfully","data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQwMzcyNDkyNjUsImRhdGEiOlt7Im1lbWJlcklkIjo4MjQ0MjcsInJld2FyZGVkUG9pbnRzIjozODc4NjM0Niwic2l0ZUlkIjozMn1dLCJpYXQiOjE2MjQwMzYzNDl9.AE_itMr-_k32Q-YxNOQcSW2L6h4LlF1eBb8tmWbMbf4"
}'; 
        $response = json_decode($response, true);
        if($response['status'] == 'success'){	
            //store_in_memcache($key, $response['data'], MEMCACHE_COMPRESSED, 900);
              return ['token'=>$response['data'],'memberId'=>$setParams['memberId']];
        } else {
              return $response;
         }         
      }
      
      private function _getMemberInfo($reqdata){
        $postUrl = $this->config['url'].'/getMemberInfo';
        $apiUsername= $this->config['user'];
        $apiPassword= $this->config['pass'];
        $curl = curl_init();
        $setParams['memberId'] = $reqdata['memberId'];
        $payloads = $setParams;
/*
        curl_setopt_array($curl, array(
          CURLOPT_URL => $postUrl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_SSL_VERIFYPEER => 0,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $payloads,
          CURLOPT_HTTPHEADER => array(
                'x-token: '.$reqdata['token'],
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
        // return $response;
 * 
 */ 
        $response = '{
    "code": 200,
    "status": "success",
    "message": "Member information",
    "data": {
        "memberId": 824427,
        "cardNumber": "8858",
        "firstName": "naval",
        "lastName": "staff",
        "rewardPoints": 38256850,
        "language": "en",
        "address": "1587 Saint-Denis",
        "address2": "",
        "postalCode": "H9P1T7",
        "province": "QC",
        "phone": "1234567890",
        "city": "Montreal",
        "email": "test@helixgs.com",
        "redeemRatio": "0.0001",
        "memberGroup": "42"
    }
}
';
        $resp = json_decode($response, true);
        if($resp['status'] == 'success'){
            $data = $resp['data'];
            return [ 'status'=>'success', 
                        'points'=>$data['rewardPoints'],
                        'memberId'=>$data['memberId'],
                        'redeemRatio'=>$data['redeemRatio'],
                        'amount'=> number_format($data['rewardPoints']*$data['redeemRatio'],2,'.',''),
                        'firstName' => $data['firstName'],
	       'lastName' => $data['lastName'],
                        'address'=>$data['address'],
                        'city'=>$data['city'],
                        'province'=>$data['province'],
                        'postal'=>$data['postalCode'],
                        'country'=>'CA',
                     ];
        } else {
            return $resp;
        }
    }
     
      private function _checkPoints($reqdata){
        $postUrl = $this->config['url'].'/check-points';
        $apiUsername= $this->config['user'];
        $apiPassword= $this->config['pass'];
        $curl = curl_init();
        $setParams['memberId'] = $reqdata['memberId'];
        $payloads = $setParams;
        /*
        curl_setopt_array($curl, array(
          CURLOPT_URL => $postUrl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_SSL_VERIFYPEER => 0,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $payloads,
          CURLOPT_HTTPHEADER => array(
                'x-token: '.$reqdata['token'],
                'Authorization: Basic '. base64_encode("$apiUsername:$apiPassword")
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
        // return $response;
         * 
         */
        $response = '{
   "code": 200,
   "status": "success",
   "message": "Member rewards points",
   "points": 38786346
}
';
        $resp = json_decode($response, true);
        return $resp;
    }
    
    private function _refreshToken($reqData) {
             $token =  $reqData['token']; 
             $postUrl = $this->config['url'].'/refresh-token';
             /*
             $curl = curl_init();
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
              * 
              */
             $response = '{
   "code": 200,
   "status": "success",
   "message": "Token updated successfully",
   "refreshtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJtZW1iZXJJZCI6ODI0NDI3LCJyZXdhcmRlZFBvaW50cyI6Mzg3ODYzNDYsInNpdGVJZCI6MzJ9XSwiZXhwIjoxNjI0MDM4NjI4MjU3LCJpYXQiOjE2MjQwMzc3Mjh9.1L95UfOhZgJGr0mtNaKksnJpft2UJmh-Sme_jhBaC9c"
}
';
            $resp = json_decode($response, true);
            return $resp;
    }

    public function placeOrder($reqData, $orderResponse) {
        $token =  $reqData['token'];
        $postUrl = $this->config['url'].'/place-order';
        $curl = curl_init();
        $payloads = $orderResponse;
        /*
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
         * 
         */
        $response = '{
   "code": 200,
   "status": "success",
   "message": "we are in travel place order function "
}
';
        $resp = json_decode($response, true);
        return $resp;  
    }       
}
