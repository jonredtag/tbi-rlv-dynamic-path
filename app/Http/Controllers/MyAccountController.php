<?php

namespace App\Http\Controllers;

use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MyAccountController extends Controller {

    public function __construct() {
        

    }
    
    public function myprofile(Request $request)
    {
        $meta=array("title"=>"My Profile",
            "description"=>"My Profile",
            "keywords"=>"My Profile"
        );
        return view('pages.my-account',['meta'=> $meta,'active'=>"home" ,'bannerData'=>'' ]);
    }


    public function updatePassword(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->updatePassword($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function updatePersonalInfo(Request $request) {
        $params = $request->all();
     
        $myAccount = app('myAccountService')->updatePersonalInfo($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }


    public function updateEmailPreferences(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->updateEmailPreferences($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function getPersonalInfo() {
       
        $myAccount = app('myAccountService')->getPersonalInfo();
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function addTraveler(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->addTraveler($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function getTraveler(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->getTraveler($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }
    

    public function deleteTraveler($TravelerId) {
        $params = array('$TravelerId'=> $TravelerId);
     
        $myAccount = app('myAccountService')->deleteTraveler($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function getUser() {

        // $params = array('$id'=> $params);
     
        $myAccount = app('myAccountService')->getUser();
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function getUserInfo() {
     
        $myAccount = app('myAccountService')->getUserInfo();
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function updateLocation(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->updateLocation($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }

    public function profileImage(Request $request) {
        $params = $request->all();
        $myAccount = app('myAccountService')->profileImage($params);
        if ($myAccount) {
            return Response::json($myAccount);
        } else {
            return Response::json([]);
        }
    }
    
    public function getTravelerData(Request $request) {
        $params = $request->all();
        $response = app('myAccountService')->getTravelerData($params);
        return Response::json($response);
    }

    public function getMyTrip(Request $request) {
        $params = $request->all();
        $response = app('myAccountService')->getMyTrip($params);
        return Response::json($response);
    }

}
