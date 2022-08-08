<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
    public function search(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $data = app('activityService')->search($params);
        } else {
            $data = $sessionState;
        }
        return Response::json($data);
    }
    
    public function details(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $params['detailMode'] = true;
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
            $count = app('activityService')->filterProduct(json_decode($params['filters'], true), $params['sid']);
            $response = app('activityService')->paginate($params);
            $response["totalResults"] = $count;
            return Response::json($response);
        } else {
            $response = $status;
            return Response::json(["activity" => $response]);
        }

    }

    public function paginate(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $response = app('activityService')->paginate($params);
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

   
     public function add(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $sessionState = app('packageService')->getSessionData($sid);
        if ($sessionState === true) {
            $data =  app('activityService')->add($params);
            return Response::json($data);
        } else {
            return Response::json($sessionState);
        }
    }
    
    public function autosuggest(Request $request, $term='')
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        $data = [];
        if (empty($sid) || $sessionState === true) {
            $data = app('activityService')->autosuggest($term);
        }
        return Response::json($data);
    }
    
        
}
