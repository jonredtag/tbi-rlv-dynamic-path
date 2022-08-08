<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CarsController extends Controller
{
    public function __construct()
    {

    }


    public function paginate(Request $request)
    {
        $params = $request->all();
        $status = app('packageService')->getSessionData($params['sid']);
        if ($status === true) {
            $response = app('packageService')->paginate('cars', $params['page']);
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
            $count = app('packageService')->filterProduct('cars', json_decode($params['filters'], true));
            $response = app('packageService')->paginate('cars', 0);
        } else {
            $response = $status;
        }

        return Response::json(["cars" => $response, "numberRecords" => $count]);
    }

    public function search(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            // if (empty($params['key'])) {
            $params['isIncremental'] = true; // $params['isIncremental'] == 'true' ? true : ($params['isIncremental'] == 'false' ? false : $params['isIncremental']);
            $response = app('packageService')->searchProduct($params['sid'], ['product' => 'cars', 'step' => 'search'], $params['isIncremental']);
        } else {
            $response = $sessionState;
        }

        return Response::json($response);
    }

    public function terms(Request $request)
    {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            // if (empty($params['key'])) {
            $session = app('packageService')->getSession($params['sid'], 'cars');
            $response = app('carsService')->getTerms($session['sessionID'], $params);
        } else {
            $response = $sessionState;
        }

        return Response::json($response);
    }

    public function details(Request $request) {
        $params = $request->all();
        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $response = app('packageService')->searchProduct($params['sid'], ['product' => 'cars', 'step' => 'details'], $params['itinerary']);
        } else {
            $response = $sessionState;
        }

        return Response::json($response);
    }

    public function updateEngine(Request $request)
    {

    }

    public function addCar(Request $request)
    {
        $params = $request->all();

        $sessionState = app('packageService')->getSessionData($params['sid']);
        if ($sessionState === true) {
            $response = app('packageService')->searchProduct($params['sid'], ['product' => 'cars', 'step' => 'details'], $params['resultId']);
            $sessionData = app('packageService')->getSession($params['sid'], 'cars');
            $data = [
                'type' => 'car',
                'resultId' => $params['resultId'],
                'rateIndex' => $params['rateIndex'],
                'sessionID' => $sessionData['sessionID'],
            ];
            return Response::json(app('packageService')->addProduct($params['sid'], $data, 'car'));
        } else {
            return Response::json($sessionState);
        }
    }
}
