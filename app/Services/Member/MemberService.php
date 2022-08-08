<?php
namespace App\Services\Member;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Support\Facades\Cache;

define("USER_TOKEN", 'user_token_1');
define("USER_ACCOUNT", 'user_account_1');

class MemberService {
    protected $repo;
  
    function __construct($repo)
    {
      $this->repo =  $repo;
    }
    
    public function checkLoginParam($param){
         $tokenParam = $this->repo->tokenProcess($param, 'check_login');
         if($tokenParam){
               \Session::put(USER_TOKEN, $tokenParam);
               return true;
         }
         return false; 
    }
    
    public function getUserData($sid){
         $resp =   \Session::get(USER_ACCOUNT);
         if(!$resp) {
            $resp = $this->tokenHandler($sid, 'get_member_info');
            if($resp['status'] =='success'){
               \Session::put(USER_ACCOUNT, $resp);
               // Cache::put($sid.'-user-acount', $resp, 1800);
            }      
         }
        return $resp; 
    }
    
    public function redirectLogin(){
        (new RedirectResponse(env("SITE_LOGIN_PAGE")))
            ->send();
    }
    
    public function checkPointsEnough($sid, $amount){
        //$userToken = Cache::get($sid.'-user-token') ;
        $userToken =   \Session::get(USER_TOKEN);
        if($userToken){
            /* 
            $resp = $this->repo->tokenProcess($userToken, 'check');
            if($resp['status'] === 'sucess'){
                  //$userMemberInfo =   Cache::get($sid.'-user-acount');
                  $userMemberInfo =   \Session::get(USER_ACCOUNT);
                  $redeemPoints = intval($amount/$userMemberInfo['redeemRatio']);
                  if($resp['points'] >= $redeemPoints){
                      return true;
                  }
            }
             * 
             */
            return true;
        }
        return false;
    }
    
    public function tokenHandler($sid, $type="check") { //create, check, refresh
        $resp = null;
        if($type==='create'){
            $resp = $this->repo->tokenProcess([], $type);
            \Session::put(USER_TOKEN, $resp);
            //Cache::put($sid.'-user-token', $resp, 1800);
        } else {
            $userToken = \Session::get(USER_TOKEN);
            //$userToken =Cache::get($sid.'-user-token') ;
            if($userToken){
                $resp = $this->repo->tokenProcess($userToken, $type);
            }
        }
        return $resp;
    }
    
    public function placeOrder($sid, $amount, $orderResponse) {
          $userToken = \Session::get(USER_TOKEN);
          $userToken = \Session::get(USER_ACCOUNT);
          //$userToken =Cache::get($sid.'-user-token') ;
          $orderReturn = $userToken;
          $orderReturn['redeemAmount'] =  $amount;
          if($userToken){
                $respRefresh = $this->repo->tokenProcess($userToken, 'refresh');
                if($respRefresh['status'] ==='success'){
                    $resp = $this->repo->placeOrder($userToken['token'], $orderResponse); 
                    $orderReturn['status'] =  $resp['status'];
                }  else {
                    $orderReturn['status'] =  'error';
                }
         }
         return $orderReturn;
    }
    
    
    
    

    
}
