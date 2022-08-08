<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AddonController extends Controller
{

    public function search(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $data =  app('addonService')->search($params);
        } else {
            $data = $sessionState;
        }
        return Response::json($data);
    }
    
    public function getActivityDetails(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $sessionState = app('packageService')->getSessionData($sid);
        if ($sessionState === true) {
            $data =  app('activityService')->getDetails($params);
        } else {
            $data = $sessionState;
        }
        return Response::json($data);
    }
    
    public function filter(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $product =  $params['product']??'activity';
            $count =   app($product.'Service')->filterProduct(json_decode($params['filters'], true), $params['sid']);
            $response = app('activityService')->paginate($params);
            $response["totalResults"] = $count;
        } else {
            $response = $status;
        }
        return Response::json($response);
    }
    
    public function paginate(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $product =  $params['product']??'activity';
            $response = app($product.'Service')->paginate($params);
        } else {
            $response = $status;
        }
        return Response::json($response);
    }
     
    public function addItem(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $sessionState = app('packageService')->getSessionData($sid);
        if ($sessionState === true) {
            $data =  app('addonService')->add($params);
            return Response::json($data);
        } else {
            return Response::json($sessionState);
        }
    }

    public function removeItem(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $sessionState = app('packageService')->getSessionData($sid);
        if ($sessionState === true) {
            $data =  app('addonService')->remove($params);
            return Response::json($data);
        } else {
            return Response::json($sessionState);
        }
    }
}