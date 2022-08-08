<?php

namespace App\Http\Controllers;

use App\Models\ShortURLSearch;
use App\Models\PricelineCity;
use Illuminate\Http\Request;
use Response;

class MarketingController extends Controller
{
    public function setDeal(Request $request)
    {
        // {"Phone": "5555555555", "Channel": "sms", "PricelineId": 800036523, "City": "Toronto", "Rooms": 1, "Adults": 2, "Children": 0, "ChildAges": ""," DepartureDate": "2020-12-21", "ArrivalDate": "2020-12-10"};
        $query = json_decode($request->input('q'), true);

        if(empty($query['Destination'])) {
            $city = PricelineCity::where('cityid_ppn', '=', $query['PricelineId'])->first();
            $query['Destination'] = [
                "category" => "city",
                "longitude" => $city->longitude,
                "latitude" => $city->latitude,
                "cityId" => $city->cityid_ppn,
                "text" => $city->city,
                "text2" => $city->country,
                "value" => $city->airport_code
            ];
        }
        $ages = !empty($query['ChildAges']) ? explode(',', $query['ChildAges']) : [];

        $searchParameters = [
            "occupancy" => [
                [
                    "adults" => $query['Adults'],
                    "children" => $query['Children'],
                    "ages" => $ages,
                ],
            ],
            "depDate" => $query['ArrivalDate'],
            "retDate" => $query['DepartureDate'],
            "depDateHotel" => null,
            "retDateHotel" => null,
            "customHotelDates" => false,
            "departure" => [],
            "destination" => $query['Destination'],
            "cabinType" => "Y",
            "trip" => "roundtrip",
            "selectedProducts" => "H",
            "lang" => "en"
        ];

        $code = uniqid();

        $short = new ShortURLSearch;

        if (isset($query['Phone'])) {
            $short->PhoneNumber = $query['Phone'];
            $short->Channel = $query['Channel'];
        }
        $short->Code = $code;
        $short->Data = json_encode($searchParameters);
        $short->Expiry = date('Y-m-d', strtotime("+1 day", strtotime($query['ArrivalDate'])));

        $short->save();

        return Response::json(["url" => route('marketDeal', ['code' => $code])]);
    }

    public function getDeal(Request $request, $code)
    {
        $deal = ShortURLSearch::where('code', '=', $code)->first();
        if($deal !== null && ($searchParameters = json_decode($deal->Data, true)) !== null) {
            $sid = $request->input('sid');
            $searchParameters['smsCode'] = $code;
            $sid = app('packageService')->buildPackage($searchParameters, $sid);

            $redirect = app('packageService')->getRoute($sid);

            return redirect($redirect."?sid=$sid");
        }
        return redirect(env('MAINSITE_URL'));
        // return view('pages.error', ["error" => ['message' => 'It seems we no longer have that deal saved. You can reload and complete an actual search.']]);
    }

    public function getRates(Request $request)
    {
        $requestData = json_decode($request->input('request'), true);
        $sid = $request->input('sid');

        $sid = app('packageService')->buildPackage($requestData, $sid);

        $sessionState = app('packageService')->getSessionData($sid);
        if ($sessionState === true) {
            $data = app('packageService')->searchProduct($sid, [ 'product' => 'hotels', 'step' => 'search', 'numResults' => 1000 ], false);
        }

        return $data;
    }

    public function resendAuthToken(Request $request, $code)
    {
        if(app('smsService')->checkCode()) {
            app('smsService')->issueAuthToken();
        }
    }

    public function checkAuthToken(Request $request, $code)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
        ]);

        $authToken = app('smsService')->checkAuthToken($data['token']);

        if ($authToken !== true) {
            return back()->with('error', $authToken['error']['message']);
        }

        app('smsService')->registerDevice();
        return redirect(route('marketDeal', ['code' => $code]));
    }

    public function register(Request $request, $code)
    {
        if(app('smsService')->checkCode()) {
            $pageTitle = 'SMS Authorize';
            $page = 'sms-auth';
            return view('pages.sms-authorize', compact('pageTitle', 'code', 'page'));
        }
        return redirect(config('app.redirect_url'));
    }

    public function hotelDetailsSearch(Request $request)
    {
        $requestData = json_decode($request->input('request'), true);
        $sid = $request->input('sid');

        $sid = app('packageService')->buildPackage($requestData, $sid);

        return redirect('/hotel/details/'.$requestData['hotelID']."?sid=$sid".(!empty($requestData['refundable'])? '&refundable=1' : ''));
    }
}
