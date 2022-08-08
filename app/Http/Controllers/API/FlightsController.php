<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FlightsController extends Controller
{
    public function __construct()
    {

    }


    public function paginate(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $response = app('packageService')->paginate('flights', $params['page']);
        } else {
            $response = $status;
        }

        return Response::json($response);
    }

    public function filter(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        $count = 0;
        if ($status === true) {
            $params['isIncremental'] = $params['isIncremental'] == 'true' ? true : ($params['isIncremental'] == 'false' ? false : $params['isIncremental']);
            $count = app('packageService')->filterProduct('flights', json_decode($params['filters'], true), $params['isIncremental']);
            $response = app('packageService')->paginate('flights', 0);
        } else {
            $response = $status;
        }

        return Response::json(["flights" => $response, "numberRecords" => $count]);
    }

    public function search(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $params['isIncremental'] = $params['isIncremental'] == 'true' ? true : ($params['isIncremental'] == 'false' ? false : $params['isIncremental']);
            $response = app('packageService')->searchProduct($params['sid'], ['product' => 'flights', 'step' => 'search'], $params['isIncremental']);
        } else {
            $response = $sessionState;
        }

        return Response::json($response);
    }

    public function details(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $response = app('packageService')->searchProduct($params['sid'], ['product' => 'flights', 'step' => 'details'], $params['itinerary']);
        } else {
            $response = $sessionState;
        }

        return Response::json($response);
    }

    public function updateEngine(Request $request)
    {
        $params = $request->all();
        $sid = $params['sid'];
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $flightsEngine = app('packageService')->getParameters($params['sid'], 'flights');
            $flightsEngine = array_merge($flightsEngine, $params['engineData']);
            app('packageService')->updateParameters($params['sid'], $flightsEngine, 'flights');

            if ($params['updateHotels']) {
                $hotelsEngine = app('packageService')->getParameters($params['sid'], 'hotels');
                $hotelsEngine['arrDate'] = $flightsEngine['depDate'];
                $hotelsEngine['depDate'] = $flightsEngine['retDate'];

                app('packageService')->updateParameters($params['sid'], $hotelsEngine, 'hotels');

                return route('hotelSearch');
            }
        } else {
            return Response::json($status);
        }
    }

    public function addFlight(Request $request, $id)
    {
        $params = $request->all();

        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $sessionData = app('packageService')->getSession($params['sid'], 'flights');
            $data = [
                'type' => 'flight',
                'rowId' => $id,
                'sessionData' => $sessionData,
            ];
            if(isset($params['checkflightarrival']) && isset($params['checkflightarrival']) == '1'){
                return Response::json(app('packageService')->checkFlightArrival($params['sid'], $data, 'flight'));
            }else{
                if(isset($params['wantsToGoWithNewDate']) && !empty($params['wantsToGoWithNewDate'])){
                    $data['wantsToGoWithNewDate']=$params['wantsToGoWithNewDate'];
                }
                return Response::json(app('packageService')->addProduct($params['sid'], $data, 'flight'));
            }
        } else {
            return Response::json($sessionState);
        }
    }

    public function setDefault(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $route = app('packageService')->setDefault($params['sid'], $params, 'flight');
        }
        return redirect($route."?sid=$params[sid]");
    }

    public function autocomplete(Request $request, $term='')
    {
        $data = app('flightsService')->autocomplete($term);

        return Response::json($data);
    }
}
