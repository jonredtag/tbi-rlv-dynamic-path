<?php

namespace App\Http\Controllers;

use App\Models\ShortUrl;
use App\Models\Airports;
use App\Models\EmailData;
use App\Models\IPBlock;
use Events;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index($wildcard = 'en')
    {
        $locales = ['en', 'fr'];
        if (in_array(strtolower($wildcard), $locales)) {
            \App::setlocale($wildcard);
        }

        return view('pages.index', ["profileConfig" => config('services.profile'), "features" => ['profile' => config('features.profile')]]);
    }

    public function buildPackage(Request $request)
    {
        $requestData = json_decode($request->input('request'), true);
        $sid = $request->input('sid');

        $sid = app('packageService')->buildPackage($requestData, $sid);

        $redirect = app('packageService')->getRoute($sid);

        return redirect($redirect."?sid=$sid".(!empty($requestData['refundable'])? '&refundable=1' : ''));
    }

    public function deepLink(Request $request)
    {
        $requestItems = $request->all();

        $requestData = [
            "cabinType" => "Y",
            "customHotelDates" => false,
            "depDate" => $requestItems['departureDate'],
            "depDateHotel" => null,
            "departure" => [],
            "destination" => [
                "cityId" => $requestItems['destinationID'],
                "latitude" => $requestItems['destinationLat'],
                "longitude" => $requestItems['destinationLong'],
                "text" => $requestItems['destination'],
                "value" => $requestItems['destinationCode']
            ],
            "lang" => "en",
            "occupancy" => [],
            "retDate" => $requestItems['returnDate'],
            "retDateHotel" => null,
            "selectedProducts" => "H",
            "trip" => "roundtrip"
        ];

        $rooms = explode('|', $requestItems['occupancy']);

        foreach ($rooms as $index => $room) {
            $occupancyParts = explode('-', $room);

            $ages = [];
            if(!empty($occupancyParts[1])) {
                $ages = explode(',', $occupancyParts[1]);
            }

            $occupancy = [
                "adults" => intval($occupancyParts[0]),
                "ages" => $ages,
                "children" => count($ages),
            ];

            $requestData['occupancy'][] = $occupancy;
        }

        if(!empty($requestItems['origin'])) {
            $requestData['departure']["text"] = $requestItems['origin'];
            $requestData['departure']["value"] = $requestItems['originCode'];
            $requestData['selectedProducts'] = 'FH';
        }

        $sid = app('packageService')->buildPackage($requestData, '');

        $redirect = app('packageService')->getRoute($sid);

        return redirect($redirect."?sid=$sid".(!empty($requestData['refundable'])? '&refundable=1' : ''));
    }

    public function hotelResults(Request $request)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);            
            $userData = null;
           if($searchParameters['selectedProducts'] ==='H' 
                   && in_array(env("SITE_KEY"),['hsbc','cibc'])){
                $tmpParam =  $searchParameters;
                $tmpParam['sid'] =  $sid;
                $login = app('memberService')->checkLoginParam($tmpParam);
                if($login){
                   $userData = app('memberService')->getUserData($sid);
                }
                if($login && $userData && $userData['status'] !=='success'){
                     app('memberService')->redirectLogin();
                }
            }
            $isIncremental = false;
            $modify = $request->input('modify');
            $breadcrumbs = app('packageService')->checkProducts($sid);
            $refundablePath = $searchParameters['refundable']??0;
            $returnData = [
                "page" => 'htl-search',
                "searchParameters" => $searchParameters,
                "isIncremental" => $isIncremental,
                "isRefundablePath"=>$refundablePath,
                "features" => [
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "sid" => $sid,
                "breadcrumbs" => $breadcrumbs,
                "currencyCode" => app('currencyService')->getCurrency(),
                "user"=>$userData,
            ];

            return view('pages.hotel-results', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function hotelDeal(Request $request, $slug = null)
    {
        if (!empty($slug) && ($short = ShortUrl::where('slug', $slug))->exists()) {
            $row = $short->first();
            $json = json_decode($row->json, true);
            $params = [
                'hotelID' => $json['hotelID'],
                'occupancy' => [
                    [
                        'adults' => intval($json['adults']),
                        'children' => intval($json['children']),
                        'ages' => !empty($json['ages']) ? $json['ages'] : [],
                    ],
                ],
                'retDate' => $json['arrDate'],
                'depDate' => $json['depDate'],
                'status' => 'accepted',
                'selectedProducts' => 'H',
                'vendor' => 'TN',
            ];
        } else {
            $params = [
                'hotelID' => $request->input('hotelID'),
                'occupancy' => [
                    [
                        'adults' => intval($request->input('adults')),
                        'children' => intval($request->input('children')),
                        'ages' => !empty($request->input('ages')) ? $request->input('ages') : [],
                    ],
                ],
                'retDate' => $request->input('arrDate'),
                'depDate' => $request->input('depDate'),
                'status' => 'invite',
                'selectedProducts' => 'H',
                'vendor' => 'TN',
            ];
        }

        $sid = app('packageService')->buildPackage($params);

        $data = app('packageService')->searchProduct($sid, ['product' => 'hotels', 'step' => 'details'], $params['hotelID']);

        if(is_null($data)) {
            return view('pages.error');
        }

        if (!isset($data['error'])) {
            return view('pages.hotel-deal', [
                "page" => "htl-deal",
                "sid" => $sid,
                "data" => $data,
                "features" => [
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "searchParameters" => $params,
                "currencyCode" => app('currencyService')->getCurrency(),
            ]);
        } else {
            return view('pages.error', $data);
        }
    }

    public function hotelDetails(Request $request, $hotelID)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            
            $userData = null;
            if($searchParameters['selectedProducts'] ==='H' 
                && in_array(env("SITE_KEY"),['hsbc','cibc'])){
                $userData = app('memberService')->getUserData($sid);
                if($userData && $userData['status'] !=='success'){
                    app('memberService')->redirectLogin();
                }
            }
            $data = app('packageService')->searchProduct($sid, [ 'product' => 'hotels', 'step' => 'details' ], $hotelID);

            if(is_null($data)) {
                return view('pages.error');
            }
            if (!isset($data['error'])) {
                $breadcrumbs = app('packageService')->checkProducts($sid);
                $refundablePath = $searchParameters['refundable']??0;

                 return view('pages.hotel-details', [
                        "isRefundablePath"=>$refundablePath,
                        "page" => "htl-details",
                        "sid" => $sid,
                        "hotelID" => $hotelID,
                        "hotelName" => $data['name'],
                        "searchParameters" => $searchParameters,
                        "breadcrumbs" => $breadcrumbs,
                        "currencyCode" => app('currencyService')->getCurrency(),
                        "features" => [
                            'profile' => config('features.profile'),
                            'addon' => (config('features.transfer') || config('features.activity'))
                        ],
                        "profileConfig" => config('services.profile'),
                        "user"=>$userData,
                ]);
            } else {
                return view('pages.error', $data);
            }
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function flightResults(Request $request, $flightNum = null)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            $breadcrumbs = app('packageService')->checkProducts($sid);
            $isIncremental = !empty($breadcrumbs['hotel']);

            $modify = $request->input('modify');
            if($modify === '1') {
                $isIncremental = true;
            }
            $returnData = [
                "page" => "flt-search",
                "sid" => $sid,
                "searchParameters" => $searchParameters,
                "features" => [
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "isIncremental" => $isIncremental,
                "breadcrumbs" => $breadcrumbs,
                "currencyCode" => app('currencyService')->getCurrency(),
            ];

            return view('pages.flight-results', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function review(Request $request)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            $breadcrumbs = app('packageService')->checkProducts($sid);
            $passengers = [ "adults" => 0, 'children' => 0, 'ages' => [] ];
            foreach ($searchParameters['occupancy'] as $room) {
                $passengers['adults'] += $room['adults'];
                $passengers['children'] += $room['children'];
                $passengers['ages']  = array_merge($passengers['ages'], $room['ages']);
            }
            $returnData = [
                "page" => "review",
                "tripInformation" => [ "passengers" => $passengers ],
                "sid" => $sid,
                "features" => [
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "breadcrumbs" => $breadcrumbs,
                'searchParameters' => $searchParameters,
            ];
            return view('pages.review', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function activityResults(Request $request)
     {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);

        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            $isIncremental = false;
            $modify = $request->input('modify');
            $breadcrumbs = app('packageService')->checkProducts($sid);

            $returnData = [
                "page" => 'act-search',
                "searchParameters" => $searchParameters,
                "isIncremental" => $isIncremental,
                "sid" => $sid,
                "breadcrumbs" => $breadcrumbs,
                "features" => ['profile' => config('features.profile')],
                "profileConfig" => config('services.profile'),
            ];

            if($modify === '1') {
                $returnData['isIncremental'] = true;
            }
            return view('pages.activity-results', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function activityDetails(Request $request, $id)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
             $params = ['sid'=>$sid, 'id'=>$id,'media'=>true];
             $data =  app('activityService')->getDetails($params);
            if(is_null($data)) {
                return view('pages.error');
            }
            if (!isset($data['error'])) {
                $searchParameters = app('packageService')->getParameters($sid);
                $breadcrumbs = app('packageService')->checkProducts($sid);

                return view('pages.activity-details', [
                    "page" => "act-details",
                    "sid" => $sid,
                    "activityIndex" => $id,
                    "name" => $data['options'][0]['name'],
                    "searchParameters" => $searchParameters,
                    "breadcrumbs" => $breadcrumbs,
                    "features" => ['profile' => config('features.profile')],
                    "profileConfig" => config('services.profile'),
                ]);
            } else {
                return view('pages.error', $data);
            }
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function carResults(Request $request)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);

        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            $isIncremental = true;
            $modify = $request->input('modify');
            $breadcrumbs = app('packageService')->checkProducts($sid);

            $returnData = [
                "page" => 'car-search',
                "searchParameters" => $searchParameters,
                "isIncremental" => $isIncremental,
                "sid" => $sid,
                "features" => [
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "breadcrumbs" => $breadcrumbs,
            ];

            if($modify === '1') {
                $returnData['isIncremental'] = true;
            }

            return view('pages.car-results', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function checkout(Request $request)
    {
        $sid = $request->input('sid');
        $accertifyUniqueID = 'DYN-STG-RLBL-' . date("YmdHis");
        \Cache::set('accertifyUniqueID', $accertifyUniqueID, 1800);
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $searchParameters = app('packageService')->getParameters($sid);
            $userData = null;
            if($searchParameters['selectedProducts'] ==='H'
                && in_array(env("SITE_KEY"),['hsbc','cibc'])) {
                $userData = app('memberService')->getUserData($sid);
                if($userData['status'] !== 'success'){
                    app('memberService')->redirectLogin();
                }
            }
            $refundablePath = $searchParameters['refundable']??0;
            $breadcrumbs = app('packageService')->checkProducts($sid);

            $isStandalone = strlen($searchParameters['selectedProducts']) === 1;
            $passengers = [ "adults" => 0, 'children' => 0, 'ages' => [] ];

            $hotel = app('packageService')->getProduct('hotel');
            if($isStandalone && $searchParameters['selectedProducts'] === 'H' && in_array($hotel['vendor'], ['EAN'])) {
                $passengers['adults'] = count($searchParameters['occupancy']);
            } else {
                foreach ($searchParameters['occupancy'] as $room) {
                    $passengers['adults'] += $room['adults'];
                    $passengers['children'] += $room['children'];
                    $passengers['ages']  = array_merge($passengers['ages'], $room['ages']);
                }
            }
            $returnData = [
                "page" => "checkout",
                "isRefundablePath"=>$refundablePath,
                "tripInformation" => [ "passengers" => $passengers ],
                "sid" => $sid,
                'searchParameters' => $searchParameters,
                "breadcrumbs" => $breadcrumbs,
                "accertifyUniqueID" => $accertifyUniqueID,
                "currencyCode" => app('currencyService')->getCurrency(),
                "features" => [
                    "choose" => config('features.choose'),
                    "manulife" => config('features.manulife'),
                    'profile' => config('features.profile'),
                    'addon' => (config('features.transfer') || config('features.activity'))
                ],
                "profileConfig" => config('services.profile'),
                "user"=>$userData,
                'localization' => config('app.localization'),
            ];            

            return view('pages.checkout', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function confirmation2(Request $request, $testId = 20014)
    {
        $page = "confirmation";

        $emailData = app('packageService')->getConfrmationData($testId);
        $currencyCode = app('currencyService')->getCurrency();
        $returnData = [
            'page' => 'confirmation',
            "emailData" => $emailData,
            "currencyCode" => $currencyCode,
            "features" => ['profile' => config('features.profile')],
            "profileConfig" => config('services.profile'),
        ];
        return view('pages.confirmation', $returnData);
    }

    public function confirmation(Request $request)
    {
        $sid = $request->input('sid');
        $sessionState = app('packageService')->getSessionData($sid);
        if($sessionState === true) {
            $returnData = [
                'searchParameters' => app('packageService')->getParameters($sid),
                "features" => ['profile' => config('features.profile')],
                "profileConfig" => config('services.profile'),
                'emailData' => app('packageService')->getConfrmationData(),
                "currencyCode" => app('currencyService')->getCurrency(),
                'page' => "confirmation",
            ];

            return view('pages.confirmation', $returnData);
        } else {
            return view('pages.error', $sessionState);
        }
    }

    public function checkLog(Request $request)
    {
        $params = $request->all();

        $log = app('paymentService')->accessLog($params);

        echo "<pre>";
        print_r($log);
    }

    public function airlineterms(Request $request){

        $sid = $request->input('sid');
        $userData = \Cache::get($_GET['sid']);
        $cartData = \Cart::get($userData['cartID']);
        if(!$cartData)
            return "";

        if (isset(($cartData['flight']['terms']['data']['cartResult']['product']['flights']))){
            return $cartData['flight']['terms']['data']['cartResult']['product']['flights']['termsContent'];
        }
    }

    public function watchPage(Request $request, $hash, $email)
    {

        return view('pages.watch-list', ['key' => $hash, 'email' => $email, 'page' => 'wtch-list']);
    }
}
