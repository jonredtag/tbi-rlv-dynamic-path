<?php

namespace App\Services\Coupon;

use App\Models\InsuranceBooking;
use App\Models\SharedPromoCode;

class CouponService
{
    protected $couponRepo;

    public function __construct($couponRepo)
    {
        $this->couponRepo = $couponRepo;
    }
    
    private function _checkCouponUsed($code){
        $couponCode = strtoupper(trim($code));
        $prefix = "VCHX-";
        if(strpos($couponCode,$prefix) !== false){
            $result =  SharedPromoCode::where('code', $couponCode)
                                                ->where('is_used','1')
                                                ->get()->first();
            if($result) {
                 return true;
            }
        }
        return false;
    }

    private function _addUsedCoupon($code,$state){
        $couponCode = strtoupper(trim($code));
        $prefix = "VCHX-";
        if(strpos($couponCode,$prefix) !== false){
            $result =  SharedPromoCode::where('code', $couponCode)
                                                ->get()->first();
            if($result) {
                 $result->is_used = $state;
                 $result->save();
            } else {
                $sharedCoupon =  new SharedPromoCode;
                $sharedCoupon->code = $couponCode;
                $sharedCoupon->product = "dynpackage";
                 $sharedCoupon->is_used = $state;
                $sharedCoupon->save();      
            }
        }
    }

    public function checkCode($params)
    {
        if($this->_checkCouponUsed($params['couponCode'])){
           return array(
               'type' => 'coupon', 
               'content' =>["error"=>"This coupon has been redeemed already"] 
            );
        }
        $data = $this->couponRepo->checkCode($params);
        if(empty($data['error'])) {
            $coupon = ['type' => 'coupon', 'content' => $data['coupon']];
            return $coupon;
        }
        return $data;
    }

    public function claimCode($params)
    {
        $couponCode = strtoupper($params['couponCode']);
        if (in_array($couponCode, ['CBF25', 'CBF50', 'CBF150', 'CCM50', 'CCM150', 'CCM250'])) {
            return true;
        }

        $data = $this->couponRepo->claimCode($params);
        $this->_addUsedCoupon($params['couponCode'], empty($data['error']));
        return $data;
    }
}
