<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ProfileSession;

class ProfileController extends Controller
{
    public function __construct()
    {

    }

    public function discoverWatcher(Request $request)
    {
        $hash = $request->input('key');
        $response = app('dealsService')->discoverWatcher($hash);
        return Response::json($response);
    }


    public function addWatch(Request $request)
    {
        $params = $request->all();

        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $params['productData']['hotel'] = app('packageService')->getProduct('hotel', $params['hotelID']);

            $rates = app('packageService')->getPrices();

            $params['rate'] = 0;
            foreach ($rates as $rate) {
                $params['rate'] += $rate['fare'];
            }
            $params['hotelID'] = $params['productData']['hotel']['unicaID'];
            $params['depart'] = $params['searchParameters']['depDate'];
            $params['return'] = $params['searchParameters']['retDate'];

            if(isset($_COOKIE['PassportUserToken'])) {
                $profile = ProfileSession::where('CookieKey', '=', $_COOKIE['PassportUserToken'])->first();

                if(!is_null($profile)){
                    $data = json_decode($profile->Data, true);
                    $params['userID'] = $data['uid'];
                }
            }

            $response = app('dealsService')->addWatchProduct($params);
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

    public function getList(Request $request, $hash, $email)
    {
        $data = app('dealsService')->getWatchList($hash, $email);


        return Response::json($data);
    }

    public function getWatchListHotels(Request $request)
    {
        $params = $request->all();
        $response = app('dealsService')->getWatchListHotels($params);
        
        return $response;

    }

    public function removeWatch(Request $request, $hash, $id)
    {
        $data = app('dealsService')->removeWatch($hash, $id);

        return Response::json($data);
    }

    public function login(Request $request)
    {
        $params = $request->all();

        $data = app('profileService')->login($params);

        return Response::json($data);
    }

    public function logout(Request $request)
    {
        $data = app('profileService')->logout();

        return Response::json($data);
    }

    public function register(Request $request)
    {
        $params = $request->all();

        $data = app('profileService')->register($params);

        return Response::json($data);
    }

    public function forgot(Request $request)
    {
        $params = $request->all();

        $data = app('profileService')->forgotPassword($params);

        return Response::json($data);
    }

    public function user(Request $request)
    {
        $data = app('profileService')->checkProfile();

        return Response::json($data);
    }
}
