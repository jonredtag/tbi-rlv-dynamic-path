<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CouponController extends Controller
{
    public function __construct()
    {

    }

    public function checkCode(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $coupon = app('packageService')->checkProduct($params['sid'], $params, 'coupon');
            if (empty($coupon['error'])) {
                app('packageService')->addProduct($params['sid'], $coupon, 'coupon');
                $response = app('packageService')->searchProduct($params['sid'], ['step' => 'search', 'product' => 'hotels'], false);
            } else {
                $response = $coupon;
            }
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

    public function removeCoupon(Request $request)
    {
        $params = $request->all();

        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            app('packageService')->removeProduct($params['sid'], 'coupon');
            if ($request->isMethod('post')) {
                $response = [
                    "sucess" => true,
                ];
            } else {
                $response = app('packageService')->searchProduct($params['sid'], ['step' => 'search', 'product' => 'hotels'], false);
            }
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

    public function verifyCoupon(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $coupon = app('packageService')->checkProduct($params['sid'], $params, 'coupon');
            if (empty($coupon['error'])) {
                app('packageService')->addProduct($params['sid'], $coupon, 'coupon');
            }
            $response = $coupon;
        } else {
            $response = $status;
        }

        return Response::json($response);
    }
}
