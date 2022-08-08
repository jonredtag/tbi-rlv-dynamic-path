<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\HotelMapping;

class HotelsController extends Controller
{
    public function __construct()
    {

    }


    public function details(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $data = app('packageService')->searchProduct($params['sid'], [ 'product' => 'hotels', 'step' => 'details' ], $params['hotel']);
        } else {
            $data = $sessionState;
        }

        return Response::json($data);
    }

    public function search(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $params['isIncremental'] = $params['isIncremental'] == 'true' ? true : ($params['isIncremental'] == 'false' ? false : $params['isIncremental']);
            $data = app('packageService')->searchProduct($params['sid'], [ 'product' => 'hotels', 'step' => 'search' ], $params['isIncremental']);
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
            $filterParams = json_decode($params['filters'], true);
            $count = app('packageService')->filterProduct('hotels', $filterParams, $params['sid']);
            $numRecords = 20;
            if(isset($filterParams['numRecordsReturn'])){
                $numRecords = intval($filterParams['numRecordsReturn']);
            }
            $response = app('packageService')->paginate('hotels', 0, $numRecords);
            return Response::json(["hotels" => $response, "numberRecords" => $count]);
        } else {
            $response = $status;
            return Response::json(["hotels" => $response]);
        }

    }

    public function paginate(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $response = app('packageService')->paginate('hotels', $params['page']);
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

    public function autocomplete(Request $request, $term = '')
    {
        $data = app('hotelsService')->autocomplete($term);

        return Response::json($data);
    }

    public function add(Request $request)
    {
        $params = $request->all();

        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $sessionData = app('packageService')->getSession($params['sid'], 'hotels');
            // dd($sessionData['detailSessionID'] ?? $sessionData['sessionID']);
           $hotelUnicaId = $params['room']['UnicaID'];  
           $hotelBedsCode =   HotelMapping::where('UnicaID',$hotelUnicaId)->value("HotelbedsID");
            $data = [
                'type' => 'hotel',
                'hotelId' => $params['hotel'],
                'hotelBedsCode'=>$hotelBedsCode,
                'roomIndex' => $params['room']['roomIndex'],
                'rate' => $params['room']['rate'],
                // 'bedTypes' => $params['bed'],
                // 'smokingPreferences' => $params['smoking'],
                'hotelsSessionID' => $sessionData['sessionID'],
                'sessionID' => $sessionData['detailSessionID'] ?? $sessionData['sessionID'],
                'resultsID' => $sessionData['detailResultsID'] ?? $sessionData['resultsID'],
            ];

            $process = app('packageService')->addProduct($params['sid'], $data, 'hotel');
        } else {
            $process = $status;
        }

        return Response::json($process);
    }

    public function updateEngine(Request $request)
    {
        $params = $request->all();
        // return Response::json($params);
        $sid = $params['sid'];
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $hotelsEngine = app('packageService')->getParameters($params['sid'], 'hotels');
            $hotelsEngine = array_merge($hotelsEngine, $params['engineData']);
            app('packageService')->updateParameters($params['sid'], $hotelsEngine, 'hotels');
            if ($params['updateFlights']) {
                $flightsEngine = app('packageService')->getParameters($params['sid'], 'flights');

                $flightsEngine['depDate'] = $hotelsEngine['arrDate'];
                $flightsEngine['retDate'] = $hotelsEngine['depDate'];
                $flightsEngine['slices'][0]['date'] = date('Y-m-d', strtotime($hotelsEngine['arrDate']));
                $flightsEngine['slices'][1]['date'] = date('Y-m-d', strtotime($hotelsEngine['depDate']));

                app('packageService')->updateParameters($params['sid'], $flightsEngine, 'flights');
            }
        } else {
            $process = $status;
            return Response::json($process);
        }
    }

    public function getTopicReviews(Request $request)
    {
        $params = $request->all();

        $response = app('packageService')->checkProduct('', $params, 'hotel-topic-review');

        return Response::json($response);
    }
}
