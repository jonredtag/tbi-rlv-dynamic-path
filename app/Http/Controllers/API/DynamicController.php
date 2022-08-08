<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DynamicController extends Controller
{
    public function __construct()
    {

    }

    public function updateSearch(Request $request)
    {
        $params = $request->all();
        $searchParams = json_decode($params['request'], true);
        $sid = app('packageService')->buildPackage($searchParams, $params['sid']);
        $route = app('packageService')->getRoute($sid);

        if(array_key_exists('product', $params)) {
            $params['isIncremental'] = $params['isIncremental'] == 'true' ? true : ($params['isIncremental'] == 'false' ? false : $params['isIncremental']);
            $data = app('packageService')->searchProduct($params['sid'], $params['product'], $params['isIncremental']);

            return Response::json($data);
        } else {
            echo $route."?sid=$sid";
        }
    }

    public function autocomplete(Request $request, $term='')
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        $data = [];
        if (empty($sid) || $sessionState === true) {
            $data = app('packageService')->autocomplete($term);
        }

        return Response::json($data);
    }

    public function autosuggest(Request $request, $term='')
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        $data = [];
        if (empty($sid) || $sessionState === true) {
            $data = app('packageService')->autosuggest($term);
        }

        return Response::json($data);
    }

    public function flightDates(Request $request)
    {
        $params = $request->all();

        $data = app('packageService')->getDates($params);

        return $data;
    }

    public function deletePackageCache(){

        \Cache::forget('destination-exclusions');
        \Cache::forget('origin-exclusions');
    }

    public function search(Request $request)
    {
        $params = json_decode($request->input('q'), true);

        $sid = $params['session']['id'] ?? '';
        $getResults = false;
        $sessionState = false;
        if ($sid !== '') {
            $sessionState = app('packageService')->getSessionData($sid);
        }

        if (count($params['searchRQ']['inputs']) > 1) {
            $sid = app('packageService')->buildPackage($params['searchRQ']['inputs'], $sid);
            $getResults = true;
        } else if ($sessionState === true) {
            $getResults = true;
        }

        $results = [];
        if($getResults) {
            $results = app('packageService')->searchProduct($sid, [ 'product' => $params['searchRQ']['inputs']['product'], 'step' => 'search', 'numResults' => 200 ], false);
        }

        $data = [
            "data" => [
                "results" => $results,
                "session" => [
                    "id" => $sid,
                ]
            ]
        ];

        return Response::json($data);
    }

    public function details(Request $request)
    {
        $params = json_decode($request->input('q'), true);

        $sid = $params['session']['id'];
        $status = app('packageService')->getSessionData($sid);
        if ($status === true) {
            $results = app('packageService')->searchProduct($sid, [ 'product' => $params['detailsRQ']['inputs']['product'], 'step' => 'details' ], $params['detailsRQ']['inputs']['key']);
        } else {
            $results = $status;
        }

        $data = [
            "data" => [
                "results" => $results,
                "session" => [
                    "id" => $sid,
                ]
            ]
        ];

        return Response::json($data);
    }

    public function footprint(Request $request)
    {
        $flight = json_decode($request->input('flightID'), true);
        $sid = $request->input('sid');

        $footprint = app('packageService')->checkProduct($sid, ["flightID" => $flight], 'choose');

        return Response::json($footprint);
    }

    public function add(Request $request)
    {
        $params = json_decode($request->input('q'), true);
        // print_r($params);
        // die();
        $sid = $params['session']['id'];
        $status = app('packageService')->getSessionData($sid);
        if ($status === true) {
            $sessionData = app('packageService')->getSession($sid, $params['addRQ']['inputs']['product']);

            if ($params['addRQ']['inputs']['product'] === 'hotels') {
                $data = [
                    'type' => 'hotel',
                    'hotelId' => $params['addRQ']['inputs']['id'],
                    'roomIndex' => $params['addRQ']['inputs']['index'],
                    'rate' => $params['addRQ']['inputs']['rate'],
                    'hotelsSessionID' => $sessionData['sessionID'],
                    'sessionID' => $sessionData['detailSessionID'] ?? $sessionData['sessionID'],
                    'resultsID' => $sessionData['detailResultsID'] ?? $sessionData['resultsID'],
                ];
            } else if ($params['addRQ']['inputs']['product'] === 'flights') {
                $data = [
                    'type' => 'flight',
                    'rowId' => $params['addRQ']['inputs']['index'],
                    'sessionID' => $sessionData['sessionID'],
                ];
            }

            $process = app('packageService')->addProduct($sid, $data, $data['type']);
        } else {
            $process = $status;
        }
    }

    public function verify(Request $request)
    {
        $params = json_decode($request->input('q'), true);
        // print_r($request->input('q'));
        // die();
        $sid = $params['session']['id'];
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $results = app('packageService')->verifyPackage($sid);
        } else {
            $results = $sessionState;
        }

        $data = [
            "data" => [
                "results" => $results,
                "session" => [
                    "id" => $sid,
                ]
            ]
        ];

        return Response::json($data);
    }

    public function book(Request $request)
    {
        $params = json_decode($request->input('q'), true);
        // print_r($params);
        // die();
        $sid = $params['session']['id'];
        $status = app('packageService')->getSessionData($sid);
        if ($status === true) {
            $params['bookRQ']['inputs']['sid'] = $sid;
            $results = app('packageService')->book($sid, $params['bookRQ']['inputs']);

            if(empty($results['error'])) {
                $results = app('packageService')->getConfrmationData();
            }
        } else {
            $results = $sessionState;
        }

        $data = [
            "data" => [
                "results" => $results,
                "session" => [
                    "id" => $sid,
                ]
            ]
        ];
        return Response::json($data);
    }
}
