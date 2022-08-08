<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Events;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CheckoutController extends Controller
{
    public function __construct()
    {

    }

    public function validation(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if($sessionState === true) {
            $data = app('packageService')->verifyPackage($params['sid']);

            return Response::json($data);
        } else {
            return Response::json($sessionState);
        }
    }
    
     public function getVerifiedPackage(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
             $verifiedData = app('packageService')->getPackageVfResults();
             return Response::json($verifiedData);      
        } else {
            return Response::json($sessionState);
        }
    }

    public function removeProduct(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if($sessionState === true) {
            return app('packageService')->removeProduct($params['sid'], $params['product']);
        } else {
            return Response::json($sessionState);
        }
    }

    public function getInsurance(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($params['sid']);
            $prices = app('packageService')->getPrices();
            $data = app('insuranceService')->getQuote($searchParameters, $prices, $params);

            return Response::json($data);
        } else {
            return Response::json($sessionState);
        }
    }

    public function book(Request $request)
    {
        $body = $request->getContent();
        $params = json_decode($body, true);
        
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if($sessionState === true) {
            $confirmation = app('packageService')->book($params['sid'], $params);
            return Response::json($confirmation);     
        } else {
            return Response::json($sessionState);
        }        
    }
}
