<?php

namespace App\Services\Package;

use App\Mail\ArrivalResponse;
use App\Mail\BookingErrorResponse;
use App\Mail\BookingResponse;
use App\Mail\ConfirmationResponse;
use App\Models\Booking;
use App\Models\EmailData;
use App\Models\IPBlock;
use App\Models\NonRefHotelRecord;
use App\Models\PricelineAirport;
use App\Models\PricelineArea;
use App\Models\PricelineCity;
use App\Models\PricelineCountry;
use App\Models\RequestLog;
use App\Models\CopoloUserBookings;
use App\Repositories\Contracts\PackageInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Helper\Helpers;
use App\Helper\MarkupHelper;
use App\Repositories\Concrete\RefundableRepository;
use Mail;

class PackageService
{
    protected $urls;
    protected $userData;

    public function __construct(PackageInterface $packageRepo)
    {
        $this->urls = [
            'hotels' => route('hotelSearch'),
            'flights' => route('flightSearch'),
            'activities' => route('activitySearch'),
            'cars' => route('carSearch'),
        ];

        $this->packageRepo = $packageRepo;
    }

    public function buildPackage($packageData, $sid = '')
    {
        $sid = !empty($sid) ? $sid : uniqid('', true);
        $userData = ['products' => [], 'sessionData' => [], 'searchParameters' => []];

        $userData['sid'] = $sid;
        $userData['searchParameters'] = $packageData;
        $userData['filterParams'] = ['hotel' => [], 'car' => []];
        $userData['inCart'] = [];
        $userData['currency'] = $userData['searchParameters']['currency'] ?? config('app.currency');
        config(['app.currency' => $userData['currency']]);
        $products = str_split($packageData['selectedProducts']);
        foreach ($products as $code) {
            if($code === 'F') {
                $userData['inCart']['flights'] = false;
            } else if ($code === 'H') {
                $userData['inCart']['hotels'] = false;
            } else if ($code === 'C') {
                $userData['inCart']['cars'] = false;
            } else if ($code === 'A') {
                $userData['inCart']['activities'] = false;
            }
        }
        $cartId = \Cart::init();
        $userData['cartID'] = $cartId;

        Cache::put($sid, $userData, 1800);
        $this->userData = $userData;

        return $sid;
    }

    public function getRoute()
    {
        if(isset($this->userData['searchParameters']['selectedProducts']) && !empty($this->userData['searchParameters']['selectedProducts']) && $this->userData['searchParameters']['selectedProducts']=="H" ){
            $route = route('hotel-checkout');
        }else if(isset($this->userData['searchParameters']['selectedProducts']) && !empty($this->userData['searchParameters']['selectedProducts']) && $this->userData['searchParameters']['selectedProducts']=="FH" ){
            $route = route('flight-hotel-checkout');
        }else{
            $route = route('checkout');
        }

        /*
        $isHotelBeds = !empty($this->userData['products']['hotel']['hotelBedsCode']);
        $iHotelBeds = true;
         *
         */
        if (isset($this->userData['inCart']['hotels']) && $this->userData['inCart']['hotels'] === false) {
            $route = $this->urls['hotels'];
            if (!empty($this->userData['products']['hotel'])) {
                $route = route('hotelSelect', ['hotelID' => $this->userData['products']['hotel']['hotelId']]);
            }
        } else if(isset($this->userData['inCart']['flights']) && $this->userData['inCart']['flights'] === false) {
            $route = $this->urls['flights'];
        } else if(isset($this->userData['inCart']['cars']) && $this->userData['inCart']['cars'] === false) {
            $route = $this->urls['cars'];
        } else if(isset($this->userData['inCart']['activities']) && $this->userData['inCart']['activities'] === false){
            $route = $this->urls['activities'];
        } else if(isset($this->userData['inCart']['hotels']) && isset($this->userData['inCart']['flights'])
            && count($this->userData['inCart'])===2 && config('features.addon_enable')){
            $route = route('review');
        }
        return $route;
    }

    public function searchProduct($sid, $process, $id = null)
    {
        if (empty($this->userData['error'])) {

            $numPassengers = $this->calcTravellers();
            if ($process['step'] === 'search') {
                $response = $this->getProducts($sid, $process['product']);

                if(!empty($response['error'])) {
                    return $response;
                }
            }

            if ($process['product'] === 'hotels') {
                $response = [];
                if(!empty($this->userData['activePrices']['flight'])) {
                    $data = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);
                    if($data === null) {
                        return ["error" => [ "code" => 's-01', "message" => "Your booking session has expired would you like to restart?" ]];
                    }
                    $response['flightProduct'] = app('flightsService')->details($data, $this->userData['activePrices']['flight']['itineraries']);
                    $extrasData = $data['data']['flightResults']['extras'];
                    $extras = ['airports' => [], 'carriers' => []];
                    foreach ($response['flightProduct'] as $segments) {
                        foreach ($segments['segments'] as $leg) {
                            $extras['airports'][$leg['origin']] = $extrasData['airports'][$leg['origin']];
                            $extras['airports'][$leg['destination']] = $extrasData['airports'][$leg['destination']];
                            $extras['carriers'][$leg['flight']['carrier']] = isset($extrasData['carriers'][$leg['flight']['carrier']]) ? $extrasData['carriers'][$leg['flight']['carrier']] : "";
                        }
                    }

                    $response['flightExtras'] = $extras;
                }

                $numPassengers = $this->calcTravellers();
                $isStandalone = strlen($this->userData['searchParameters']['selectedProducts']) === 1;
                if ($process['step'] === 'search') {
                    $this->userData['activePrices'] = $this->userData['cartPrices'];
                    if(isset($this->userData['products']['coupon'])) {
                        $response['coupon'] = $this->userData['products']['coupon']['content']['code'];
                    }
                    $hotelResults = \Cache::get("htl-".$this->userData['sessionData']['hotels']['sessionID']);
                    $results = app('hotelsService')->translateSearch($hotelResults, $this->userData['activePrices'], $id, $numPassengers, $isStandalone, $this->userData['searchParameters']['hotelID'] ?? null);
                    \Cache::put("htl-translated-".$this->userData['sessionData']['hotels']['sessionID'], $results, 1800);
                    $count = $this->filterProduct('hotels', $this->userData['filterParams']['hotel']);
                    $response["filters"] = $results['filters'];
                    $response["filterValues"] = $this->userData['filterParams']['hotel'];
                    $response["numberRecords"] = $count;
                    $response["package"] = [];

                    if($id) {
                        $cart = \Cart::get($this->userData['cartID']);
                        $response['package'] = $cart['hotel'];
                        $response['package']['rate'] = 0;
                        $response['package']['currency'] = config('app.currency');
                        foreach ($this->userData['activePrices'] as $price) {
                            $response['package']['rate'] += $price['fare'];
                        }
                    }
                    if(!isset($process['numResults'])) {
                        $response['hotels'] = $this->paginate('hotels', 0);
                    } else {
                        $response['hotels'] = $this->paginate('hotels', 0, $process['numResults']);
                    }
                    if(env('SMS_LOCK', false)) {
                        app('smsService')->saveHistory( $this->userData['searchParameters'], 'search');
                    }
                } else if ($process['step'] === 'details') {
                    if(empty($this->userData['sessionData']['hotels'])) {
                        $data = $this->getHotel($id);

                        if(empty($data['error'])) {
                            if(!empty($this->userData['products']['flight']['checkinChanged'])) {
                                $this->userData['sessionData']['hotels']['dateChange'] = true;
                            }
                            $sessionID = $this->userData['sessionData']['hotels']["sessionID"];

                            $markupHelper = new MarkupHelper($this->userData['cartID']);
                            $data = $markupHelper->applyHotelDetailsMarkup($data['hotels.markup'], $data['hotel']);
                            Cache::put("htl-room-$id:".$sessionID, $data, 1800);
                        } else {
                            $data = $data['hotel'];
                            if($data['error']['code'] === 'S200') {
                                $data['error']['url'] = $this->urls['hotels'].'?sid='.$sid;
                            }
                        }
                    } else {
                        $sessionID = $this->userData['sessionData']['hotels']["sessionID"];
                        if(empty($this->userData['products']['hotel']) || $id != $this->userData['products']['hotel']['hotelId'] || !Cache::has("htl-room-$id:".$sessionID)) {
                            $hotelResults = \Cache::get("htl-".$this->userData['sessionData']['hotels']['sessionID']);
                            if ($hotelResults !== null) {
                                foreach ($hotelResults['rows'] as $index => $hotel) {
                                    if ($hotel['hotelId'] == $id) {
                                        break;
                                    }
                                }

                                $isRefundable = (isset($this->userData['searchParameters']) && isset($this->userData['searchParameters']['refundable']) && $this->userData['searchParameters']['refundable'] === 1);

                                $data = $this->packageRepo->hotelDetails($this->userData['sessionData']['hotels'], ['rowIndex' => $hotel['positionIndex'], 'lang' => \App::getLocale()], $isRefundable);
                                if(empty($data['error'])) {
                                    $markupHelper = new MarkupHelper($this->userData['cartID']);
                                    $markup = Cache::get('htl-markup-' . $this->userData['cartID']);
                                    $data = $markupHelper->applyHotelDetailsMarkup($markup, $data);
                                    Cache::put("htl-room-$id:".$sessionID, $data, 1800);
                                    if(env('SMS_LOCK', false)) {
                                        app('smsService')->saveHistory(array_merge(
                                            [
                                                'hotelID' => $id,
                                                'price' => (count($data['data']['roomResults']['rows']) > 0 ? $data['data']['roomResults']['rows'][0]['rateinfo']['pricingInfo']['totalBase'] : null),
                                            ],
                                            $this->userData['searchParameters']
                                        ), 'details');
                                    }
                                } else {
                                    $data['error']['url'] = $this->urls['hotels'].'?sid='.$sid;
                                    $response = $data;
                                }
                            } else {
                                $data = [
                                    "error" => [
                                        "code" => "s-01",
                                        "message" => "Your booking session has expired would you like to restart?"
                                    ]
                                ];
                            }
                        } else {
                            $data = Cache::get("htl-room-$id:".$sessionID);
                        }
                        if(isset($this->userData['sessionData']['hotels']['dateChange'])) {
                            $response['flashMessage'] = 'The flight you selected arrives after the initial check-in date for your hotel. We have re-optained the availability information for your selected hotel please re-verify room option as they may have changed.';
                            unset($this->userData['sessionData']['hotels']['dateChange']);
                        }
                    }

                    if (is_null($data) || !empty($data['error'])) {
                        return $data;
                    }

                    $response = array_merge($response, app('hotelsService')->translateDetails($data['data'], $this->userData['activePrices'], $numPassengers, $this->userData['searchParameters'], $isStandalone));

                    if(isset($this->userData['activePrices']['flight'])) {
                        $data = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);
                        $response['flightProduct'] = app('flightsService')->details($data, $this->userData['activePrices']['flight']['itineraries']);
                    }

                    $response = array_merge($response, $this->getPackageTotal());
                }
            } elseif ($process['product'] === 'flights') {
                $response = [];
                $data = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);

                if (is_null($data)) {
                    $response = ["error" => [ "code" => 's-01', "message" => "Your booking session has expired would you like to restart?" ]];
                } else {
                    if($process['step'] === 'search') {
                        if (!empty($this->userData['inCart']['hotels'])) {
                            $cart = \Cart::get($this->userData['cartID']);
                            $data['data']['package']['hotel'] = $cart['hotel'];
                            $data['data']['package']['rate'] = 0;
                            foreach ($this->userData['activePrices'] as $price) {
                                $data['data']['package']['rate'] += $price['fare'];
                            }
                        }
                        if((count($data['data']['flightResults']['extras']['slices'][$this->userData['activePrices']['flight']['itineraries'][0]]['segments']) >= 1
                            || count($data['data']['flightResults']['extras']['slices'][$this->userData['activePrices']['flight']['itineraries'][1]]['segments']) >= 1)
                            && !$this->userData['inCart']['flights']
                        ) {
                            foreach ($data['data']['flightResults']['rows'] as $rowID =>$row) {
                                if(count($data['data']['flightResults']['extras']['slices'][$row['itineraries'][0]]['segments']) === 1
                                    && count($data['data']['flightResults']['extras']['slices'][$row['itineraries'][1]]['segments']) === 1
                                ) {
                                    $data['data']['nonStop'] = [
                                        'fare' => $row['priceInfo']['cheapest']['saleTotal']['amount'] - $this->userData['activePrices']['flight']['fare'],
                                    ];
                                    break;
                                }
                            }
                        }
                        $filterParams=$this->userData['filterParams']['flight']??[];
                        $data['data']['flightResults']['numberRecords'] = $this->filterProduct('flights', $filterParams, $id);
                        $data['data']['flightResults']['rows'] = $this->paginate('flights', 0);
                        $data['data']['flightResults']['full'] = $this->paginate('flights', 0, 0);
                        $response = app('flightsService')->translate($data, $this->userData['activePrices'], $this->userData['searchParameters']['cabinType']);
                        $count = $this->filterProduct('flights', $filterParams,$id);
                        $response["filterValues"] = $this->userData['filterParams']['flight'];
                        $response["numberRecords"] = $count;
                        $response['package']['currency'] = config('app.currency');
                    } else if($process['step'] === 'details') {
                        $response = app('flightsService')->details($data, explode(',', $id));
                    }

                }
            } else if ($process['product'] === 'cars') {
                $carResults = \Cache::get('car-'.$this->userData['sessionData']['cars']['sessionID']);

                if (is_null($carResults)) {
                    $response = ["error" => [ "code" => 's-01', "message" => "Your booking session has expired would you like to restart?" ]];
                } else {
                    $response = [];
                    if($process['step'] === 'search') {
                        if(isset($this->userData['activePrices']['flight'])) {
                            $data = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);
                            if($data === null) {
                                return ["error" => [ "code" => 's-01', "message" => "Your booking session has expired would you like to restart?" ]];
                            }
                            $response['package']['flightData']['flight'] = app('flightsService')->details($data, $this->userData['activePrices']['flight']['itineraries']);
                            $extrasData = $data['data']['flightResults']['extras'];
                            $extras = ['airports' => [], 'carriers' => []];
                            foreach ($response['package']['flightData']['flight'] as $segments) {
                                foreach ($segments['segments'] as $leg) {
                                    $extras['airports'][$leg['origin']] = $extrasData['airports'][$leg['origin']];
                                    $extras['airports'][$leg['destination']] = $extrasData['airports'][$leg['destination']];
                                    $extras['carriers'][$leg['flight']['carrier']] = $extrasData['carriers'][$leg['flight']['carrier']];
                                }
                            }

                            $response['package']['flightData']['extras'] = $extras;
                        }

                        if (!empty($this->userData['inCart']['hotels'])) {
                            $cart = \Cart::get($this->userData['cartID']);
                            $response['package']['hotel'] = $cart['hotel'];
                        }
                        $response['package']['rate'] = 0;
                        foreach ($this->userData['activePrices'] as $price) {
                            $response['package']['rate'] += $price['fare'];
                        }

                        $this->userData['activePrices'] = $this->userData['cartPrices'];
                        list($results, $grid) = app('carsService')->translateSearch($carResults, $this->userData['activePrices'], $id, $numPassengers);
                        \Cache::put("car-translated-".$this->userData['sessionData']['cars']['sessionID'], $results, 1800);
                        $count = $this->filterProduct('cars', $this->userData['filterParams']['car']);
                        $response['numberRecords'] = $count;
                        $response['filters'] = $carResults['extras']['filters'];
                        $response["filterValues"] = $this->userData['filterParams']['car'];
                        $response['grid'] = $grid;
                        $response['cars'] = $this->paginate('cars', 0);
                    } else if ($process['step'] === 'details') {
                        foreach ($carResults['rows'] as $car) {
                            if($car['resultId'] == $id) {
                                break;
                            }
                        }

                        $params = [
                            "resultId" => $id,
                            "pickup" => $car['puLocId'],
                            "dropoff" => $car['doLocId'],
                        ];
                    }
                }
            }

            Cache::put($sid, $this->userData, 1800);

            return $response;
        } else {
            return $userData;
        }
    }

    public function filterProduct($product, $params=[], $extraParam=null)
    {
        $count = 0;
        $numPassengers = $this->calcTravellers();
        if ($product === 'hotels' && isset($this->userData['sessionData']['hotels'])) {
            $this->userData['filterParams']['hotel'] = $params;
            $hotelResults = \Cache::get("htl-translated-".$this->userData['sessionData']['hotels']['sessionID']);
            $hotels = app('hotelsService')->filter($hotelResults['hotels'], $params);
            $count = count($hotels);
            if($extraParam !== null){
                \Cache::put($extraParam, $this->userData, 1800);
            }
            \Cache::put('htl-filteredResults-'.$this->userData['sessionData']['hotels']['sessionID'], $hotels, 1800);
        } elseif ($product === 'flights' && isset($this->userData['sessionData']['flights'])) {
            $this->userData['filterParams']['flight'] = $params;
            $cachedFlights = \Cache::get("ft-".$this->userData['sessionData']['flights']['sessionID']);
            $flights = app('flightsService')->filter($cachedFlights['data']['flightResults'], $params, $this->userData['activePrices'], $numPassengers, $this->userData['searchParameters']['cabinType'], $extraParam);
            $count = count($flights);
            if($extraParam !== null){
                \Cache::put($extraParam, $this->userData, 1800);
                if(isset($this->userData['sid']) && !empty($this->userData['sid'])){
                    \Cache::put($this->userData['sid'], $this->userData, 1800);
                }
            }
            \Cache::put('ft-filteredResults-'.$this->userData['sessionData']['flights']['sessionID'], $flights, 1800);
        } elseif ($product === 'cars') {
            $this->userData['filterParams']['car'] = $params;
            $carResults = \Cache::get("car-translated-".$this->userData['sessionData']['cars']['sessionID']);
            $cars = app('carsService')->filter($carResults, $params);
            $count = count($cars);
            if($extraParam !== null){
                \Cache::put($extraParam, $this->userData, 1800);
            }
            \Cache::put('car-filteredResults-'.$this->userData['sessionData']['cars']['sessionID'], $cars, 1800);
        }
        return $count;
    }

    public function paginate($product, $page, $numRecords=20)
    {
        if ($numRecords === 0) {
            $numRecords = 2000;
        }

        $response = [];
        $start = $page * $numRecords;
        if ($product === 'hotels' && isset($this->userData['sessionData']['hotels'])) {
            $hotelResults = \Cache::get("htl-translated-".$this->userData['sessionData']['hotels']['sessionID']);
            $results = \Cache::get('htl-filteredResults-'.$this->userData['sessionData']['hotels']['sessionID']);
            $hotelIDs = array_splice($results, $start, $numRecords);
            foreach ($hotelIDs as $id) {
                $response[] = $hotelResults['hotels'][$id];
            }
        } elseif ($product === 'flights' && isset($this->userData['sessionData']['flights'])) {
            $results = \Cache::get('ft-filteredResults-'.$this->userData['sessionData']['flights']['sessionID']);
            $end =  min((($page + 1) * $numRecords), count($results));
            for ($i=$start; $i < $end; $i++) {
                $response[] = $results[$i];
            }
        } elseif ($product === 'cars') {
            $hotelResults = \Cache::get("car-translated-".$this->userData['sessionData']['cars']['sessionID']);
            $results = \Cache::get('car-filteredResults-'.$this->userData['sessionData']['cars']['sessionID']);
            $hotelIDs = array_splice($results, $start, $numRecords);
            foreach ($hotelIDs as $id) {
                $response[] = $hotelResults[$id];
            }
        }

        return $response;
    }

    public function autocomplete($term = '')
    {
        if (isset($this->userData['searchParameters']) && isset($this->userData['searchParameters']['refundable']) && $this->userData['searchParameters']['refundable'] === 1) {
            $data = (new RefundableRepository())->Gateways($term);
        } else {
            if ($term === '') {
                return [];
            }
            $data = $this->packageRepo->autocomplete($term);
        }

        $exclusions = Cache::get('origin-exclusions');

        $autocompleteData = [];
        foreach ($data as $index =>  $row) {
            if(!in_array($row['code'], $exclusions)) {
                $autocompleteData[] = [
                    "category" => "airport",
                    "text" => $row['name'],
                    "value" => $row['code'],
                    "text2" => $row['location'],
                    "id" => $row['code'],
                    "latitude" => $row['latitude'],
                    "longitude" => $row['longitude'],
                    "index" => $index,
                ];
            }
        }

        return $autocompleteData;
    }

    public function autosuggest($term = '')
    {
        if (isset($this->userData['searchParameters']) && isset($this->userData['searchParameters']['refundable']) && $this->userData['searchParameters']['refundable'] === 1) {
            $data = (new RefundableRepository())->Destinations($term);
        } else {
            if ($term === '') {
                return [];
            }
            $data = $this->packageRepo->autosuggest(['filter' => $term]);
        }


        $response = [];
        $index = 0;

        foreach ($data['cities'] as $city) {
            if ( empty($city['latitude']) || empty($city['longitude'])) continue;
            $row = [
                "category" => 'city',
                "index" => $index++,
                "longitude" => $city['longitude'],
                "latitude" => $city['latitude'],
                "cityId" => $city['ID'],
                "text" => $city['name'],
                "text2" => (!empty($city['state']) ? $city['state'] . ', ' : '' ) . $city['country'],
                "value" => $city['iata'],
            ];

            $response[] = $row;
        }

        foreach ($data['airports'] as $airport) {
            if ( empty($airport['latitude']) || empty($airport['longitude'])) continue;
            $row = [
                "category" => 'airport',
                "index" => $index++,
                "longitude" => $airport['longitude'],
                "latitude" => $airport['latitude'],
                "cityId" => '',
                "text" => $airport['name'],
                "text2" => $airport['city'],
                "value" => $airport['iata'],
            ];

            $response[] = $row;
        }

        return $response;
    }

    public function getDates($params)
    {
        $data = (new RefundableRepository())->getDates($params);

        return $data;
    }

    public function getPrices()
    {
        return $this->userData['activePrices'];
    }

    public function getPackageTotal()
    {
        $response = [];
        $response['packageTotal'] = 0;
        $response['baseRate'] = 0;
        $prices = $this->userData['activePrices'];
        foreach ($prices as $price) {
            $response['packageTotal'] += isset($price['fare'])?$price['fare']:0;
            $response['baseRate'] += isset($price['base'])?$price['base']:0;
        }
        $response['packageTotal'] = ((isset($prices['hotel']) && !empty($prices['hotel'])) || !isset($prices['hotel'])) ? floor($response['packageTotal']) : false;
        $response['products'] = '';
        if (count($prices) > 1) {
            $response['products'] .= array_key_exists('hotel', $prices) ? 'hotel, ' : '';
            $response['products'] .= array_key_exists('flight', $prices) ? 'flight(s), ' : '';
            $response['products'] .= array_key_exists('transfer', $prices) ? 'transfer, ' : '';
        }
        return $response;
    }

    public function getDepartureFlight($sid, $key)
    {
        $userData = $this->userData;
        $data = Cache::get("ft-flightSegments".$userData['sessionData']['flights']['sessionID']);

        $response = app('flightsService')->translateDepartureFlight($data['segments'][$key]);

        $rate = intval($response['price']['amount']);

        $this->userData['activePrices']['flight'] = $rate;

        Cache::put($sid, $this->userData, 1800);
        return $response;
    }

    public function verifyPackage($sid)
    {
        if (empty($this->userData['error'])) {
            $data = \Cart::verify($this->userData['cartID']);
            $numPassengers = $this->calcTravellers();
            $reundablePath =  $this->this->userData['searchParameters']['refundable']??0;

            if (empty($data['error'])) {
                $returnData = [
                    "cost" => [
                        "total" => 0,
                        "taxes" => 0,
                        "salesTax" => 0,
                        "costPer" => 0,
                        "subTotal" => 0,
                        "baseRate" => 0,
                        "travellers" => $numPassengers,
                        "priceChange" => 0,
                        "currency" => config('app.currency'),
                    ],
                    'hasDeposit' => $reundablePath,
                    'depositDuration' => config('features.deposit_date'),
                    "cibcAccount" => [],
                    "notes" => [],
                ];

                if (env('SITE_KEY') === 'cibc') {
                    $cibcDetail =  json_decode('{"member_unique_id":"84151103449","member_first_name":"Test","member_last_name":null,"member_email":"84151103449@airmiles.ca","member_phone_number":null,"member_address_line_1":null,"member_address_line_2":null,"member_city":null,"member_subregion":null,"member_country":null,"member_postal_code":null,"locale":"en","destination":null,"program_id":"2","program_name":"AIR MILES\u00ae","segment_code":"Blue","order_token":"JukfcOKO50a3PePsYra0m_7aDeE-D8bAt7iCmuMdChE=","branding_logo_url":null,"branding_logo_width":null,"branding_logo_height":null,"branding_logo_background_color":null,"branding_header":null,"branding_primary_color":null,"branding_secondary_color":null,"branding_domain_name":null,"session_refresh_url":null,"timeout_redirect_url":null,"error_redirect_url":null,"return_url":null,"currency_CAD_name":"Canadian Dollar","currency_CAD_redeemable":"true","currency_CAD_balance":null,"currency_CAD_balance_required":"false","currency_CAD_balance_viewable":"false","currency_CAD_min":null,"currency_CAD_max":null,"currency_CAD_increments":null,"currency_CAD_subunit_name":"Cent","currency_CAD_subunit_multiplier":"100","currency_CAD_thousands_separator":",","currency_CAD_decimal_mark":".","currency_XRO-ADM_name":"Dream Miles","currency_XRO-ADM_redeemable":"true","currency_XRO-ADM_balance":"5940000","currency_XRO-ADM_balance_required":"true","currency_XRO-ADM_balance_viewable":"true","currency_XRO-ADM_min":"909","currency_XRO-ADM_max":null,"currency_XRO-ADM_increments":"9","currency_XRO-ADM_subunit_name":null,"currency_XRO-ADM_subunit_multiplier":null,"currency_XRO-ADM_thousands_separator":",","currency_XRO-ADM_decimal_mark":".","currency_exchange_CAD_to_XRO-ADM":"9.09","currency_exchange_XRO-ADM_to_CAD":"0.11"}', TRUE);
                    $returnData['cibcAccount'] = array(
                        'accountId'=>$cibcDetail['member_unique_id'],
                        'balance'=>$cibcDetail['currency_XRO-ADM_balance'],
                        'amount'=>intval(floor(100*$cibcDetail['currency_XRO-ADM_balance']/$cibcDetail['currency_XRO-ADM_min'])),
                    );
                }

                if (!empty($data['flight'])) {
                    $flight = $data['flight']['verifyResult']['products']['flight'];
                    $returnData['flight'] = [];
                    $availableCabin = [];
                    foreach ($flight['slices'] as $slice) {
                        $legs = [];
                        $duration = 0;
                        $destination = '';
                        $departureDate = substr($slice['segments'][0]['legs'][0]['departure'], 0, -6);
                        foreach ($slice['segments'] as $index => $leg) {
                            $layover = 0;
                            $destination = $leg['destination'];

                            if (isset($slice['segments'][$index + 1])) {
                                $startTime = strtotime($leg['legs'][0]['arrival']);
                                $endTime = strtotime($slice['segments'][$index + 1]['legs'][0]['departure']);
                                $layover =  ($endTime - $startTime) / 60;
                            }
                            $availableCabin[] = $slice['segments'][0]['legs'][0]['cabin'] ?? 'Cabin type unknown';
                            $legs[] = [
                                "carrierCode"           => $leg['flight']['carrier'],
                                "flightNumber"          => $leg['flight']['number'],
                                "carrier"               => $flight['extras']['carriers'][$leg['flight']['carrier']]['name'],
                                "operatedBy"            => isset($leg['flight']['operatingAirline']) && $leg['flight']['operatingAirline'] !== $leg['flight']['carrier'] ? $leg['flight']['operatingAirline'] : '',
                                "class"                 => $slice['segments'][0]['legs'][0]['cabin'] ?? 'Cabin type unknown', // $leg['bookingInfos']['cabin'] === 'Y' ? 'Economy Class' : ($slice['segments'][0]['bookingInfos']['cabin'] === 'S' ? 'Premium Economy' : 'Business Class'),
                                "departureCode"         => $leg['origin'],
                                "departureCity"         => $flight['extras']['airports'][$leg['origin']]['city'],
                                "departureName"         => $flight['extras']['airports'][$leg['origin']]['name'],
                                "departureDatetime"     => substr($leg['legs'][0]['departure'], 0, -6),
                                "destinationCode"       => $leg['destination'],
                                "destinationCity"       => $flight['extras']['airports'][$destination]['city'],
                                "destinationName"       => $flight['extras']['airports'][$destination]['name'],
                                "arrivalDatetime"       => substr($leg['legs'][0]['arrival'], 0, -6),
                                "duration"              => $leg['legs'][0]['duration'],
                                "layoverTime"           => $layover,
                            ];
                            $arrivalTime = substr($leg['legs'][0]['departure'], 0, -6);
                            $arriavalDate = substr($leg['legs'][0]['arrival'], 0, -6);
                            $duration += $leg['legs'][0]['duration'];
                        }

                        if (!empty($this->userData['searchParameters']['flights']['pax']['ages'])) {
                            $pax['ages'] = $this->userData['searchParameters']['flights']['pax']['ages'];
                        }
                        $returnData['flight'][] = [
                            "departureCode"         => $legs[0]['departureCode'],
                            "departureCity"         => $flight['extras']['airports'][$legs[0]['departureCode']]['city'],
                            "destinationCode"       => $destination,
                            "destinationCity"       => $flight['extras']['airports'][$destination]['city'],
                            "departureDatetime"     => $departureDate,
                            "arrivalDatetime"       => $arriavalDate,
                            "trip"                  => !empty($this->userData['searchParameters']['flights']['trip']) ? $this->userData['searchParameters']['flights']['trip'] : '',
                            "class"                 => $legs[0]['class'],
                            "pax"                   => $pax ?? [],
                            "flightTime"            => $duration,
                            "travelTime"            => $slice['duration'],
                            "stops"                 => $slice['stopCount'],
                            "legs"                  => $legs,
                        ];
                    }
                    $classes = [
                        "P" => 'Premium First Class',
                        "F" => 'First Class',
                        "J" => 'Premium Business Class',
                        "C" => 'Business Class',
                        "S" => 'Premium Economy Class',
                    ];

                    if ($this->userData['searchParameters']['cabinType'] != 'Y' && count(array_diff($availableCabin, [$classes[$this->userData['searchParameters']['cabinType']]])) > 0) {
                        $returnData['notes']['flights'][] = '*Not all flight legs are in the class selected';
                    }


                    $base = (float)$flight['rateInfo']['pricingInfo']['total'];
                    $this->userData['activePrices']['flight']['fare'] = $base / $numPassengers;

                    $returnData['cost']['total'] += (float)$flight['rateInfo']['pricingInfo']['total'];
                    $returnData['cost']['taxes'] += $flight['rateInfo']['pricingInfo']['totalTaxes'] / $numPassengers;
                    $returnData['cost']['costPer'] += ((float)$flight['rateInfo']['pricingInfo']['totalBase'] / $numPassengers);
                    $returnData['cost']['baseRate'] += (float)$flight['rateInfo']['pricingInfo']['totalBase'];
                    // $returnData['cost']["priceChange"] += ($flight['price']['verifyPrice'] - $flight['price']['searchPrice']);
                    $returnData['cost']["priceChange"] += ($this->userData['activePrices']['flight']['fare'] - $this->userData['cartPrices']['flight']['fare']);

                    $this->userData['cartPrices']['flight'] = [
                        "fare" => $this->userData['activePrices']['flight']['fare'],
                        "base" => (float)$flight['rateInfo']['pricingInfo']['totalBase'],
                        "taxes" => $flight['rateInfo']['pricingInfo']['totalTaxes'],
                        "itineraries" => $this->userData['activePrices']['flight']['itineraries'],
                    ];

                    if (config('features.choose')) {
                        $chooseData = app('chooseService')->getCarbonRate(
                            [ 'product' => 'flight',
                              'segments' => $returnData['flight'], 
                              'class' => 'Y'
                            ], $numPassengers);

                        if (empty($chooseData['error'])) {
                            $returnData['choose'] = $chooseData;
                            $this->userData['products']['choose'] = $returnData['choose'];
                        }
                    }
                }

                if (!empty($data['hotel'])) {
                    $isStandalone = strlen($this->userData['searchParameters']['selectedProducts']) === 1;
                    $checkInDate = \Carbon\Carbon::parse($this->userData['searchParameters']['depDate'])->tz('UTC');
                    $checkOutDate = \Carbon\Carbon::parse($this->userData['searchParameters']['retDate'])->tz('UTC');
                    $duration = intVal($checkInDate->diff($checkOutDate)->format('%a'));
                    $numRooms = count($this->userData['searchParameters']['occupancy']);
                    $ages = [];
                    foreach ($this->userData['searchParameters']['occupancy'] as $room) {
                        if (!empty($room['ages'])) {
                            $ages = array_merge($ages, $room['ages']);
                        }
                    }
                    $watchedHotel = false;
                    if (config('features.profile')) {
                        $watchedHotel = app('dealsService')->isHotelWatched([
                            'hotelID' => $data['hotel']['UnicaID'],
                            'depDate' => $this->userData['searchParameters']['depDate'],
                            'retDate' => $this->userData['searchParameters']['retDate']
                        ]);
                    }
                    $hotel = $data['hotel']['verifyResult']['products']['hotel'];
                    $rateinfo = $hotel['roomResults']['rows'][0]['rateInfo'][0];
                    $checkIn = new \DateTime($hotel['roomResults']['checkInDate'] ." ". $hotel['hotelDetails']['checkInTime']);
                    $checkOut = new \DateTime($hotel['roomResults']['checkOutDate'] ." ". $hotel['hotelDetails']['checkOutTime']);
                    $startDate = new \DateTime($this->userData['searchParameters']['depDate']);
                    $endDate = new \DateTime($this->userData['searchParameters']['retDate']);
                    $numNights = $startDate->diff($endDate);
                    $returnData['hotel'] = [
                        "image" => [],
                        "name" => $hotel['hotelDetails']['hotelName'],
                        "id" => $hotel['hotelDetails']['hotelId'],
                        "room" => $rateinfo['attr']['roomDescription'],
                        "rating" => $data['hotel']['hotelRating'],
                        "checkin" => $checkIn->format('Y-m-d H:i:s'),
                        "checkout" => $checkOut->format('Y-m-d H:i:s'),
                        "numRooms" =>  count($this->userData['searchParameters']['occupancy']), // $hotel['roomResults']['noOfRooms'],
                        "numNights" => intval($numNights->format('%d')), // $hotel['roomResults']['noOfNights'],
                        "occupants" => [
                            // 'adults' => $hotel['roomResults']['noOfAdults'],
                            // 'children' => $hotel['roomResults']['noOfChildren'],
                            'ages' => $ages
                        ],
                        "address" => $hotel['hotelDetails']['location']['address']['ad1'],
                        "cityCountry" => $hotel['hotelDetails']['location']['address']['city'] .', '. $hotel['hotelDetails']['location']['address']['countryCode'],
                        "amenities" => $hotel['hotelDetails']['propertyAmenities'],
                        // "subTotal" => $rateinfo['pricingInfo'][0]['totalBase'],
                        // "total" => $rateinfo['pricingInfo'][0]['total'],
                        // "taxes" => $rateinfo['pricingInfo'][0]['totalTaxes'],
                        'watched' => $watchedHotel,
                        "mandatory" => [],
                        "cancellationPolicy" => [],
                        "checkInInstructions" => [],
                    ];

                    if(!empty($hotel['hotelDetails']['hotelImages'])) {
                        $count = 0;
                        foreach ($hotel['hotelDetails']['hotelImages'] as $image) {
                            if(strpos($image['url'], '.jpg') !== false) {
                                $returnData['hotel']['image'][] = $image['url'];
                                $count++;
                            }
                            if($count === 2) {
                                break;
                            }
                        }
                    }

                    foreach ($rateinfo['pricingInfo'][0]['surcharges'] as $surcharge) {
                        if ($surcharge['type'] === 'SalesTax') {
                            $returnData['hotel']['salesTax'] = $surcharge['amount'];
                            break;
                        }
                    }

                    $cancellations = !empty($rateinfo['pricingInfo'][0]['cancellationPolicy']) ? $rateinfo['pricingInfo'][0]['cancellationPolicy'] : [];
                    if(count($cancellations)){
                        $cancellationPolicy = "";
                        $isFree = false;
                        $cancellationPolicies = [];
                        $refundableDate = null;
                        foreach ($cancellations as $entries) {
                            foreach($entries as $key => $policy) {
                                $policyText = '';
                                $now = \Carbon\Carbon::now()->tz('UTC')->hour(0);
                                $after = \Carbon\Carbon::parse($policy['date_after'])->tz('UTC')->hour(0);
                                if($after->lessThan($now)) {
                                    $after = $now;
                                }
                                $before = \Carbon\Carbon::parse($policy['date_before'])->tz('UTC')->hour(0);

                                $penalty = '$' . $policy['display_total_charges'] . ' ' . $policy['display_currency'];
                                if($policy['display_total_charges'] == 0 || $policy['display_total_charges'] == 25) {
                                    $policyText = "Free cancellation up until ".$before->format('M d, Y').".";
                                    $isFree = true;
                                    $refundableDate = $before->format('Y-m-d');
                                // }
                                // else if($before->greaterThan($checkInDate)) {
                                //     $policyText = "Cancelling as of ".$checkInDate->format('M d, Y')." will incur a pentalty of $penalty";
                                } else {
                                    if (\App::getLocale() == 'en') {
                                        $penalty = '$' . $policy['display_total_charges'] . ' ' . $policy['display_currency'];
                                        $policyText = "Cancelling between ".$after->format('M d, Y')." and ".$before->format('M d, Y')." incurs a penalty of $penalty.";
                                    } else {
                                        $penalty = number_format($policy['display_total_charges'], 2, ',', ' ') . ' ' . $policy['display_currency'];
                                        $policyText = "L’annulation entre ".$after->format('M d, Y')." et ".$before->format('M d, Y')." encourt des frais de pénalités de $penalty.";
                                    }
                                }
                                $policyText = $policyText."<br /><br />";

                                if(!$isFree) {
                                    array_unshift($cancellationPolicies, $policyText);
                                } else {
                                    array_push($cancellationPolicies, $policyText);
                                }
                            }
                        }

                        $cancellationPolicy = implode('', $cancellationPolicies);

                        $returnData['hotel']['cancellationPolicy'][] = ["paragraph_0"=> substr($cancellationPolicy, 0, -12)];
                        if(!is_null($refundableDate)) {
                            $returnData['hotel']['refundable'] = $refundableDate;
                        }
                    }

                    if(!empty($data['hotel']['verifyResult']['products']['hotel']['roomResults']['extras']['mandatory_infos']['hotel'])) {
                        $returnData['hotel']['mandatory'][] = ["paragraph_0"=> $data['hotel']['verifyResult']['products']['hotel']['roomResults']['extras']['mandatory_infos']['hotel']];
                    }
                    //dd($hotel);
                    if (!empty($rateinfo['pricingInfo'][0]['hotelFees'])) {
                        $returnData['cost']['extraFees'] = $rateinfo['pricingInfo'][0]['hotelFees'];
                    }
                 
                    if (!empty($hotel['hotelDetails']["checkInInstructions"]) || !empty($hotel['hotelDetails']['specialCheckInInstructions'])) {
                        $returnData['hotel']['checkInInstructions'][0]['paragraph_0'] = !empty($hotel['hotelDetails']["checkInInstructions"]) ? $hotel['hotelDetails']["checkInInstructions"] : '';
                        $returnData['hotel']['checkInInstructions'][0]['paragraph_0'] .= !empty($hotel['hotelDetails']["specialCheckInInstructions"]) ? $hotel['hotelDetails']["specialCheckInInstructions"] : '';
                    }

                    $returnData['hotel']['cancellation'] = $rateinfo['pricingInfo'][0]['refundable'] ?? false;

                    $returnData['cost']['total'] += $rateinfo['pricingInfo'][0]['total'];
                    $returnData['cost']['taxes'] += $isStandalone ? $rateinfo['pricingInfo'][0]['totalTaxes'] : $rateinfo['pricingInfo'][0]['totalTaxes'] / $numPassengers;
                    $returnData['cost']['salesTax'] += $returnData['hotel']['salesTax'] ?? 0;
                    $returnData['cost']['costPer'] += $isStandalone ? $rateinfo['pricingInfo'][0]['totalBase'] / $duration / $numRooms : ($rateinfo['pricingInfo'][0]['totalBase'] / $numPassengers);
                    $returnData['cost']['baseRate'] += $rateinfo['pricingInfo'][0]['totalBase'];
                    if ($isStandalone) {
                        $returnData['cost']['numRooms'] = $numRooms;
                        $returnData['cost']['numNights'] = $duration;
                    }

                    if ($isStandalone) {
                        $returnData['cost']["priceChange"] += ($rateinfo['pricingInfo'][0]['totalBase'] - $this->userData['cartPrices']['hotel']['base']) / $duration / $numRooms;
                    } else {
                        $returnData['cost']["priceChange"] += (($rateinfo['pricingInfo'][0]['total'] / $numPassengers) 
                                                                - $this->userData['cartPrices']['hotel']['fare']);
                    }
                    
                    $this->userData['cartPrices']['hotel'] = [
                        "fare" => $rateinfo['pricingInfo'][0]['total'] / $numPassengers,
                        "base" => $rateinfo['pricingInfo'][0]['totalBase'],
                        "taxes" => $rateinfo['pricingInfo'][0]['totalTaxes'],
                    ];

                    if (config('features.choose') && empty($data['flight']) ) {
                       
                        $chooseData = app('chooseService')->getCarbonRate(
                            [ 'product' => 'hotel',
                              'nights' => intval($numNights->format('%d')), 
                              'rooms' => count($this->userData['searchParameters']['occupancy']),
                            ], $numPassengers);
                        
                        if (empty($chooseData['error'])) {
                            $returnData['choose'] = $chooseData;
                            $this->userData['products']['choose'] = $returnData['choose'];
                        }
                    }
                }

                if(!empty($data['coupon'])) {
                    if ($data['coupon']['status'] === 'success') {
                        $this->userData['cartPrices']['coupon'] = [
                            "fare" => -$data['coupon']['verifyResult']['value'] / $numPassengers,
                            "base" => 0,
                            "value" => -$data['coupon']['verifyResult']['value'],
                            "taxes" => 0,
                        ];

                        $returnData['coupon'] = [
                            'code' => $data['coupon']['code'],
                            'costs' => $this->userData['cartPrices']['coupon'],
                        ];
                    } else {
                        $returnData['coupon'] = $data['coupon']['verifyResult'];
                    }
                }

               if(!empty($data['transfer'])) {
                    $fare =  $data['transfer']['value'];
                    $total =  $fare*$numPassengers;
                    $this->userData['cartPrices']['transfer'] = [
                          "fare" => $fare,
                          "base" => $total,
                          "taxes" => 0,
                      ];
                    $returnData['cost']['total'] += $total;
                    $returnData['cost']['costPer'] += $fare ;
                    $returnData['cost']['baseRate'] += $total;
                    $returnData['transfer'] = [
                        'costs' => $total,
                    ];
                }

                if (!empty($data['car'])) {
                    $car = $data['car']['verifyResult']['products']['car'];
                    $rateinfo = $car['rateInfo'];
                    $pickupDateTime = \DateTime::createFromFormat('m/d/Y H:i', $car['searchParam']['pickupDate'].' '.$car['searchParam']['pickupTime']);
                    $dropoffDateTime = \DateTime::createFromFormat('m/d/Y H:i', $car['searchParam']['dropoffDate'].' '.$car['searchParam']['dropoffTime']);
                    $returnData['car'] = [
                        "image" => $car['rentalInfo']['image'],
                        "resultId" =>$car['rentalInfo']['rid'],
                        "vendor" => $car['rentalInfo']['vendor'],
                        "doors" => $car['rentalInfo']['doors'],
                        "passengers" => $car['rentalInfo']['passengers'],
                        "luggage" => $car['rentalInfo']['luggage'],
                        "transmission" => $car['rentalInfo']['transmission'],
                        "rate" => [
                            "description" => $rateinfo['description'],
                            "included" => $rateinfo['included'],
                            "inclusive" => $rateinfo['inclusive'],
                        ],
                        "name" => $car['rentalInfo']['name'],
                        "class" => $car['rentalInfo']['class'],
                        "pickupDate" => $pickupDateTime->format('F jS Y, H:i a'),
                        "dropoffDate" => $dropoffDateTime->format('F jS Y H:i a'),
                        "pickup" => $car['extras']['locations'][$car['rentalInfo']['puLocId']],
                        "dropoff" => $car['extras']['locations'][$car['rentalInfo']['doLocId']],
                    ];
                    if ($data['car']['verifyResult']['details']['dropfee']['cad'] > 0) {
                        $returnData['notes']['cars'][] = 'There is a drop fee of $'.number_format($data['car']['verifyResult']['details']['dropfee']['cad'], 2).' on the car rental to be paid at location for returning to a different location.';
                    }
                    $returnData['cost']['total'] += $rateinfo['total'];
                    $returnData['cost']['taxes'] += $rateinfo['tax'] / $numPassengers;
                    $returnData['cost']['costPer'] += $rateinfo['total'] / $numPassengers;
                    $returnData['cost']['baseRate'] += $rateinfo['total'] - $rateinfo['tax'];
                    $returnData['cost']["priceChange"] += (($rateinfo['total'] / $numPassengers) - $this->userData['cartPrices']['car']['fare']);
                    $this->userData['cartPrices']['car'] = [
                        "fare" => $rateinfo['total'] / $numPassengers,
                        "base" => $rateinfo['total'] - $rateinfo['tax'],
                        "taxes" => $rateinfo['tax'],
                    ];
                }

                $returnData['cost']['subTotal'] += $returnData['cost']['taxes'] + $returnData['cost']['costPer'];

                if(!empty($this->userData['sessionData']['addon']['selectedInfo'])){
                     $packageVfTime = $sid.'-'.$data['vfTimeStamp'];
                     if($packageVfTime === $this->userData['sessionData']['addon']['packageVfTimeStamp']){
                         $returnData['addon'] = app('addonService')->getSelectedProducts($sid);
                     } else {
                         app('addonService')->resetSelectedProducts($sid);
                     }
                } elseif(!empty($this->userData['sessionData']['activity']['selectedInfo'])){
                     $activity = $this->userData['sessionData']['activity']['selectedInfo'];
                     $returnData['addon']['activity'] = app('activityService')->getSelectedProducts($sid);
                     $returnData['addon']['totalAmount'] =  $activity['fare'];
                }
                Cache::put($sid, $this->userData, 1800);
                return $returnData;
            } else {
                $resetLink = $this->urls[$data['error']['product']];

                $data['error']['route'] = $resetLink;

                return $data;
            }
        } else {
            return $this->userData;
        }
    }

    public function getParameters($sid)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            return $userData['searchParameters'];
        } else {
            return $userData;
        }
    }

    public function updateParameters($sid, $data)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            $userData['searchParameters'] = $data;
            $userData['inCart'] = [ 'hotels' => false, 'flights' => false ];
            $userData['sessionData'] = [];
            $this->userData = $userData;
            Cache::put($sid, $userData, 1800);
            $route = $this->urls['hotels'];

            return $route."?sid=$sid";
        } else {
            return $userData;
        }
    }

    public function setDefault($sid, $params, $product)
    {
        $numPassengers = $this->calcTravellers();
        if ($product === 'flight') {
            $request = [
                "sessionID" => $this->userData['sessionData']['flights']['sessionID'],
                "rowId" => $params['rowId'],
            ];

            $productData = app('flightsService')->getSelectedResult($request);

            $this->userData['cartPrices']['flight'] = [
                "fare" => $productData['priceInfo']['cheapest']['saleTotal']['amount'],
                "base" => $productData['priceInfo']['cheapest']['saleFareTotal']['amount'] * $numPassengers,
                "taxes" => $productData['priceInfo']['cheapest']['saleTaxTotal']['amount'],
                "itineraries" => $productData['itineraryIDs'],
            ];
            $this->userData['activePrices'] = $this->userData['cartPrices'];
        }

        Cache::put($sid, $this->userData, 1800);
        return $this->getRoute();
    }

    public function addProduct($sid, $data, $product)
    {
        if (empty($this->userData['error'])) {
            $numPassengers = $this->calcTravellers();

            if($product === 'car') {
                $carResults = \Cache::get('car-'.$this->userData['sessionData']['cars']['sessionID']);

                foreach ($carResults['rows'] as $car) {
                    // dd($car);
                    if($car['resultId'] == $data['resultId']) {
                        break;
                    }
                }

                $data['inputs'] = [
                    "resultId" => $data['resultId'],
                    "pickup" => $car['puLocId'],
                    "dropoff" => $car['doLocId'],
                ];
            }

            $data['sid'] = $sid;
            $productData = \Cart::add($this->userData['cartID'], $data);

            if ($product === 'hotel') {
                $this->userData['cartPrices']['hotel'] = [
                    "fare" => $productData['roomResult']['rateinfo']['pricingInfo']['total'] / $numPassengers,
                    "base" => $productData['roomResult']['rateinfo']['pricingInfo']['totalBase'],
                    "taxes" => $productData['roomResult']['rateinfo']['pricingInfo']['totalTaxes'],
                ];
                $this->userData['inCart']['hotels'] = true;

                $vendor = '';
                if (isset($productData['vendor'])) {
                    $vendor = $productData['vendor'] === 'P' ? 'PPN' : $productData['vendor'];
                }

                if ($vendor === '') {
                    if (preg_match("/_[A-Z]{3}$/", $productData['vendorId'])) {
                        $vendor = substr($productData['vendorId'], -3);
                    } else {
                        $vendor = 'TTS';
                    }
                }
                $data['location'] = $productData['location'];
                $data['hotelName'] = $productData['hotelName'];
                $data['vendor'] = $vendor;
            } elseif ($product === 'flight') {
                $this->userData['cartPrices']['flight'] = [
                    "fare" => $productData['priceInfo']['cheapest']['saleTotal']['amount'],
                    "base" => $productData['priceInfo']['cheapest']['saleFareTotal']['amount'] * $numPassengers,
                    "taxes" => $productData['priceInfo']['cheapest']['saleTaxTotal']['amount'],
                    "itineraries" => $productData['itineraryIDs'],
                ];
                $this->userData['inCart']['flights'] = true;

                $itinerary = $productData['itineraries'][0];
                $segment = array_pop($itinerary['segments']);
                $leg = array_pop($segment['legs']);

                $returnFlight = $productData['itineraries'][1]['segments'][0]['flight'];
                $returnFirstLeg =  $productData['itineraries'][1]['segments'][0]['legs'][0];
                $data['arrDestTime'] = $leg["arrival"];
                $data['arrFlightInfo'] = $segment['flight'];
                $data['depDestTime'] = $returnFirstLeg["departure"];
                $data['depFlightInfo'] = $returnFlight;
                $data['destAirport'] = $returnFirstLeg["origin"];

                $checkin = $this->userData['searchParameters']['depDateHotel'] ?? $this->userData['searchParameters']['depDate'];

                $checkInDate = strtotime($checkin);
                $flightArrivalDate = strtotime(substr($leg['arrival'], 0, 16));
                $data['checkinChanged'] = false;
                if (isset($this->userData['inCart']['hotels']) && ($flightArrivalDate - $checkInDate) > 86400) {
                    if(isset($data['wantsToGoWithNewDate']) && $data['wantsToGoWithNewDate'] == true){
                        $this->updateHotelSearch(substr($leg['arrival'], 0, 10));
                    }

                    if(!isset($this->userData['products']['flight']) || (isset($this->userData['products']['flight']) && !isset($this->userData['products']['flight']['changedCheckin']))) {
                        $data['changedCheckin'] = $checkInDate; // This might need to be turned on but has been disabled since the begining
                        $data['checkinChanged'] = true;
                    }
                } else if (isset($this->userData['products']['flight']) && isset($this->userData['products']['flight']['changedCheckin'])) {
                    if ($flightArrivalDate < $checkInDate) {
                        $changedCheckin = $this->userData['products']['flight']['changedCheckin'];
                        if(isset($data['wantsToGoWithNewDate']) && $data['wantsToGoWithNewDate'] == true){
                            if(($flightArrivalDate - $changedCheckin) > 86400) {
                                $this->updateHotelSearch(substr($leg['arrival'], 0, 10));
                            } else {
                                $this->updateHotelSearch(date('Y-m-d', $changedCheckin));
                            }
                        }
                    }
                }

                if (isset($this->userData['inCart']['cars'])) {
                    $this->updateCarsSearch($productData);
                }
            } elseif ($product === 'car') {
                $carRates = $productData['details']['rates'][$data['rateIndex']];
                $this->userData['cartPrices']['car'] = [
                    "fare" => $carRates['total'] / $numPassengers,
                    "base" => $carRates['total'] - $carRates['tax'],
                    "taxes" => $carRates['tax'],
                ];
                $this->userData['inCart']['cars'] = true;
            } elseif ($product === 'coupon') {
                $this->userData['cartPrices']['coupon'] = [
                    "fare" => (-1 * $productData['value']) / $numPassengers,
                    "base" => 0,
                    "taxes" => 0,
                    "value" => (-1 * $productData['value']),
                ];
            } elseif ($product === 'transfer') {
                $this->userData['cartPrices']['transfer'] = [
                    "fare" =>  $productData['value'],
                    "base" => $productData['value'] * $numPassengers,
                    "taxes" => 0,
                ];
            }
            $this->userData['products'][$product] = $data;
            $this->userData['activePrices'] = $this->userData['cartPrices'];
            Cache::put($sid, $this->userData, 1800);
            return $this->getRoute();
        } else {
            return $this->userData;
        }
    }

    public function removeProduct($sid, $product)
    {
        $data = \Cart::remove($this->userData['cartID'], $product);

        if ($product === 'flight') {
            unset($this->userData['inCart']['flights']);
        } elseif ($product === 'hotel') {
            unset($this->userData['inCart']['hotels']);
        }
        unset($this->userData['products'][$product]);
        unset($this->userData['cartPrices'][$product]);
        unset($this->userData['activePrices'][$product]);

        Cache::put($sid, $this->userData, 1800);
    }

    public function addSession($sid, $sessionData, $product)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            $userData['sessionData'][$product] = $sessionData;
            $this->userData =  $userData;
            Cache::put($sid, $userData, 1800);
        } else {
            return $userData;
        }
    }

    public function removeSession($sid, $product)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            unset($userData['sessionData'][$product]);
            $this->userData =  $userData;
            Cache::put($sid, $userData, 1800);
        } else {
            return $userData;
        }
    }

    public function getSession($sid, $product)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            return !empty($userData['sessionData'][$product]) ? $userData['sessionData'][$product] : null;
        } else {
            return $userData;
        }
    }

    private function _setupVccNumber(&$tempParams, $cartData, $bookingId, $bookingNumber, $transactionID){
        $pax = $tempParams['passengerInformation'][0];
        //hotel only /hotel+flights
        $pricingInfo = $cartData['hotel']['verifyResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0];
        $hotelAmount = $pricingInfo['total'] - (isset($pricingInfo['markupCommission']) ? $pricingInfo['markupCommission'] : 0);
        $checkOutDate = new \DateTime($cartData['hotel']['verifyResult']['products']['extra']['request']['depDate']);
        $checkInDate = new \DateTime($cartData['hotel']['verifyResult']['products']['extra']['request']['arrDate']);
        $duration = intVal($checkInDate->diff($checkOutDate)->format('%a'));
        $virtualCardParam = array(
            'bookingRef'=>$bookingId,
            'bookingNo'=>$bookingNumber,
            'amount'=>$hotelAmount,
            'clientName'=>$pax['first'] .(!empty($pax['middle'])?' '.$pax['middle']:'')." ".$pax['last'],
            'deptDate'=> str_replace("-", "", $cartData['hotel']['verifyResult']['products']['extra']['request']['depDate']),
            'retDate'=>str_replace("-", "", $cartData['hotel']['verifyResult']['products']['extra']['request']['arrDate']),
            'duration'=>$duration,
            'invoiceNo'=>$transactionID,
            'invoiceDate'=>date("Ymd"), //today
        );
        $virtualCard = app('virtualCardService')->getVirtualCard($virtualCardParam);
        if(!isset($virtualCard['error'])){
            //setup card
            $tempParams['paymentInformation']['cardType'] = $virtualCard['cardInfo']['cardType'];
            $tempParams['paymentInformation']['card'] = $virtualCard['cardInfo']['number'];
            $tempParams['paymentInformation']['expiry'] = substr($virtualCard['cardInfo']['expiredDate'],4,2)."/".substr($virtualCard['cardInfo']['expiredDate'],0,4) ;
            $tempParams['paymentInformation']['security'] = $virtualCard['cardInfo']['cvv'];
            return $virtualCard;
        } else {
            return false;
        }
    }
    
    private function _cancelTransInErrorMode($transactionIds, $cardCosts, $bookingId){
        foreach($transactionIds as $tranId) {
            $request = [
                "transid" => $tranId,
                "bookingnum" =>$bookingId,
                'currency' => app('currencyService')->getCurrency(),
            ];

            $charge = app('paymentService')->cancel($request);
            if (!$charge['success']) {
                $emailData['subject'] = "payment void failed to complete.";
                $emailData['paymentFailed'] = true;
                $emailData['payment'] = [
                    'total' => $cardCosts[$idx],
                ];
                Mail::to(config('mail.error_address'))->send(new BookingErrorResponse($emailData));
            }
       }
    }

    public function book($sid, $params)
    {
        $cartData = \Cart::get($this->userData['cartID']);
        $bookDevTest = env('BOOK_DEV_TEST',0); //for internal debug purpose
        $paymentMethod =  $params['paymentInformation']['paymentMethod']; //loan or normal
        
        if (empty($this->userData['error'])) {
            $isStandalone =  strlen($this->userData['searchParameters']['selectedProducts']) ==1;  
            if ($this->userData['searchParameters']['selectedProducts'] ==='H' && env("SITE_KEY") ==='hsbc') {
               $resp =  app('memberService')->tokenHandler($sid, 'refresh');
                if(!$resp || ($resp && $resp['status'] !=='success')){
                    return   [
                            "error" => [
                                "code" => 'B05',
                                "message" => "Site token expired",
                              ],
                        ];
                }
                if($params['paymentInformation']['redeemAmount'] >0) {
                    $isEnough = app('memberService')->checkPointsEnough($sid, $params['paymentInformation']['redeemAmount']);
                    if(!$isEnough){
                         return   [
                                "error" => [
                                    "code" => 'B02',
                                    "message" => "No engought Points to redeem",
                                  ],
                          ];
                    }
                }
            }
            $accertifyDetailsPrecall = null;
            if (config('accertify.enabled') && $paymentMethod !='loan') {
                $accertifyArgs = [
                    'userData' => $this->userData,
                    'params' => $params,
                    'preCall' => true,
                    'cartData' => $cartData,
                    'productCode' => $this->userData['searchParameters']['selectedProducts'],
                ];
                // perform pre booking accertify
                $accertifyDetailsPrecall = app('accertifyService')->status($accertifyArgs);
                if ($accertifyDetailsPrecall['score'] >= config('accertify.scoreRange.high.min')) {
                    $error = ["error" => ["code" => "ACC1", "message" => "We are unable to complete your online transaction at this time.  Please contact one of our Travel Professionals for more information", "product" => 'Accertify']];
                    return $error;
                }
            }
            if (!empty($this->userData['products']['hotel'])) {
                $params['hotelData'] = $this->userData['products']['hotel'];
            }

            if(!empty($cartData['coupon']) /*&& $cartData['coupon']['status'] !== 'error'*/) {
                $cost = 0;
                $base = 0;

                foreach ($this->userData['cartPrices'] as $key => $product) {
                    if ($key != 'coupon') {
                        $cost += $product['base'] + $product['taxes'];
                        $base += $product['base'];
                    }
                }
                $numPassengers = $this->calcTravellers();
                $coupon = app('couponService')->checkCode(['couponCode' => $cartData['coupon']['code'], 'cost' => $cost, 'costPer' => $cost / $numPassengers, 'baseCostPer' => $base / $numPassengers]);
                if(!empty($coupon['error'])){
                    return $coupon;
                }
            }

            $products = 0;
            if (isset($cartData['hotel'])) {
                $products += 1;
            }
            if (isset($cartData['flight'])) {
                $products += 2;
            }
            if(isset($cartData['car'])) {
                $products += 4;
            }

            $booking = new Booking;

            $booking->cart_id = $this->userData['cartID'];
            $booking->booking_status = 1;
            $booking->booked_products = $products;
            $booking->active = 1;
            $booking->site_id = config('site.booking_site');
            $booking->amount = $params['costs']['total'];

            $profile = null;
            if (config('features.profile')) {
                $profile = app('profileService')->checkProfile();

                if(empty($profile['error']) && $profile['userID']) {
                    $booking->user_id = $profile['userID'];
                }
            }

            $booking->save();

            $booking->booking_number = 'RLV-'.$booking->id;
            $this->userData['bookingID'] = $bookingId = $booking->id;
            $this->userData['bookingNumber'] = $bookingNumber =  $booking->booking_number;
            $this->userData['bookingTotal'] = $params['costs']['total'];
            $cost = number_format($params['costs']['total'],2,'.','');
            if ($params['paymentInformation']['petroInformation']['redeemDollarAmount'] > 0) {
                $cost -= $params['paymentInformation']['petroInformation']['redeemDollarAmount'];
            }
            if ($params['paymentInformation']['redeemAmount'] > 0) {
                $cost -= $params['paymentInformation']['redeemAmount'];
            }
            
            if(!empty($params['costs']['addon'])){
                $cost += number_format($params['costs']['addon'],2,'.','');
            }
            
            $creditCards = $params['paymentInformation']['creditCards'];
            $insuranceCost = (!empty($params['insuranceSummary']['total']) ? $params['insuranceSummary']['total'] : 0);
            $chooseCost = (!empty($params['costs']['choose']) ? $params['costs']['choose'] : 0);

            $transactionIds =  $cardCosts = $cardNumbers = $cardExpirys = $cardTypeNames = [];
            foreach($creditCards as $idx=>$card){
                if(!empty($card)){
                    $cardCost =  $card['amount'];
                    if($idx==0){
                        $cardCost -= $insuranceCost + $chooseCost;
                    }
                    $cardNumbers[] = $cardNumber = str_replace("-",'', $card['ccNumber']);
                    list($cardTypeCode, $cardTypeNames[]) = Helpers::getCardTypeAndName($cardNumber);
                    if(empty($cardTypeCode)){
                        if(!empty($transactionIds)){
                            $request = [
                                "transid" => $transactionIds[0],
                                "bookingnum" => $booking->id
                            ];
                            $charge = app('paymentService')->cancel($request);
                            if (!$charge['success']) {
                                $emailData['subject'] = "payment void failed to complete.";
                                $emailData['paymentFailed'] = true;
                                $emailData['payment'] = [
                                    'total' => $cardCosts[$idx],
                                ];
                                Mail::to(config('mail.error_address'))->send(new BookingErrorResponse($emailData));
                            }
                            unset($transactionIds[0]);
                        }
                        break;
                    }
                    $cardExpiry = str_replace(['/','_'],'', trim($card['ccExpiry']));
                    $month = substr($cardExpiry,0,2);
                    $year =  intval(substr($cardExpiry,2, strlen($cardExpiry)-2));
                    if($year<99){
                        $year = '20'.$year;
                    }
                    $cardExpirys[] = $month."/".$year;
                    $request = array();
                    $request['amount'] = $cardCosts[] = number_format($cardCost,2,'.','');
                    $request['ccnum'] = $cardNumber; //test card : 4761739012345603
                    $request['ccName'] = $card['ccName'];
                    $request['cvc'] = $card['ccCVV'];
                    $request['expiry'] = ['year' => $year, 'month' => $month] ;
                    $request['cctype']   = $cardTypeCode; // $cardTypeCode;
                    $request['cvdvalue'] = $card['ccCVV'];
                    $request['departuredate'] = date('Ymd', strtotime($this->userData['searchParameters']['depDate']));
                    $request['bookingnum'] = $booking->id;
                    $request['currency'] = app('currencyService')->getCurrency();
                    $paymentData = app('paymentService')->authorize($request);
                    if ($paymentData['success']) {
                        $transactionIds[] = $paymentData['transactionID'];
                    } else {
                        if(!empty($transactionIds)){
                            $request = [
                                "transid" => $transactionIds[0],
                                "bookingnum" => $booking->id,
                                'currency' => app('currencyService')->getCurrency(),
                            ];
                            $charge = app('paymentService')->cancel($request);
                            if (!$charge['success']) {
                                $emailData['subject'] = "payment collection failed to complete.";
                                $emailData['paymentFailed'] = true;
                                $emailData['payment'] = [
                                    'total' => $cardCosts[$idx],
                                ];
                                Mail::to(config('mail.error_address'))->send(new BookingErrorResponse($emailData));
                            }
                            unset($transactionIds[0]);
                        }
                        break;
                    }
                }
            }

            if ($cost ==0 || !empty($transactionIds)) {
                /*******************************************************************
                *  Mulitple Credit Card, provide the first one for most
                *  product booking path
                *********************************************************************/
                if($cost > 0){
                    $card = $creditCards[0];
                    $creditCard = array(
                        'expiry'=>$cardExpirys[0],
                        'security'=>$card['ccCVV'],
                        'holder'=>$card['ccName'],
                        'card'=>$cardNumbers[0],
                        'city'=>$card['city'],
                        'province'=>$card['province'],
                        'postal'=>$card['postalZip'],
                        'address'=>$card['address'],
                        'country'=>$card['country'],
                    );
                    $params['paymentInformation'] = array_merge($params['paymentInformation'],$creditCard);
                    /***************************************************************/
                    $transactionID = implode("-",$transactionIds);
                    $booking->transaction_id = $transactionID;
                } else {
                    $booking->transaction_id = 0;
                    //provide fake card infor
                    
                    if ($this->userData['searchParameters']['selectedProducts'] ==='H' && env("SITE_KEY") ==='hsbc') {
                        $params['paymentInformation']['card'] = '4111111111111111';
                        $params['paymentInformation']['cardType'] = 'VI';
                        $params['paymentInformation']['security'] = '123';
                        $params['paymentInformation']['expiry'] =  "12/2030";
                        $userData = app('memberService')->getUserData($sid);
                        if($userData['status'] =='success'){
                            $params['paymentInformation']['holder'] =   $userData['firstName'].' '. $userData['lastName'];
                            $params['paymentInformation']['address'] =  $userData['address'];
                            $params['paymentInformation']['city'] = $userData['city'];
                            $params['paymentInformation']['province'] = $userData['province'];
                            $params['paymentInformation']['postal'] = $userData['postal'];
                            $params['paymentInformation']['country'] = $userData['country'];
                        } else {
                            return [
                                "error" => [
                                    "code" => 'B02',
                                    "message" => "We are having difficulty in getting user account information, please try again later",
                                ],
                            ];
                        }
                    }
                }
                $emailData = [
                    "bookingNumber" => $booking->booking_number,
                    "bookingDate" => (string)$booking->create_time,
                    "bookingID" => $booking->id,
                    'refundablePath'=>$this->userData['searchParameters']['refundable']??0,
                ];
                $ip = Helpers::getClientIp();
                $userLocation = [
                    "country" => '',
                    "city" => '',
                    "region" => ''
                ];

                $block = IPBlock::getByIP($ip)->get()->first();
                if ($block !== null) {
                    $userLocation = $block->locationData;
                }

                 $emailData['contact'] = [
                    "address" => $params['paymentInformation']['address']??($creditCards[0]['address']??''),
                    "city" => $params['paymentInformation']['city']??($creditCards[0]['city']??''),
                    "province" => $params['paymentInformation']['province']??($creditCards[0]['province']??''),
                    "country" => $params['paymentInformation']['country']??($creditCards[0]['country']??''),
                    "postal" => $params['paymentInformation']['postal']??($creditCards[0]['postalZip']??''),
                    "phoneNumber" => $params['passengerInformation'][0]['phone'],
                    "email" => $params['passengerInformation'][0]['email'],
                    "ip" => $ip,
                    "ipLocation" => $userLocation['city'].', '.$userLocation['region'].', '.$userLocation['country'],
                    "browser" => $_SERVER['HTTP_USER_AGENT']
                ];

                $emailData['passengers'] = [];
                foreach ($params['passengerInformation'] as $traveller) {
                    $emailData['passengers'][] = [
                        "name" => (!empty($traveller['title']) ? $traveller['title'] . '. ' : '') . $traveller['first'] . ' ' . (!empty($traveller['middle']) ? $traveller['middle'] . ' ' : '') . $traveller['last'],
                        "birthDate" => (!empty($traveller['day']) && !empty($traveller['month']) && !empty($traveller['year']) ? $traveller['day'].'/'.$traveller['month'].'/'.$traveller['year'] : ''),
                    ];
                }

                $bookingSuccess = null;
                $hotelNoError = true;
                $flightNoError = true;
                $carNoError = true;
                if (isset($cartData['hotel'])) {
                    $payWithVirtual = !empty($cartData['hotel']['vendor']) && !$bookDevTest;

                    if ($cartData['hotel']['roomResult']['rateinfo']['pricingInfo']['refundable'] === true || $cartData['hotel']['roomResult']['rateinfo']['pricingInfo']['refundable'] === '') {
                        $tempParams = $params;
                        $hotel = $cartData['hotel']['verifyResult']['products']['hotel']['roomResults'];

                        $tempParams['cost'] = $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'];
                        if(!empty($params['costs']['deposit'])) {
                            $tempParams['cost'] = (($hotel['checkInDate'] < '2021-12-18' || $hotel['checkInDate'] > '2022-01-05') ? $params['costs']['deposit'] : $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['minDeposit']);
                        }

                        $tempParams['base'] = $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'];
                        $tempParams['paymentInformation']['card'] = '4111111111111111';
                        $tempParams['paymentInformation']['cardType'] = 'VI';
                        $tempParams['paymentInformation']['security'] = '123';
                        $tempParams['sessionId'] = $cartData['hotel']['sessionId'];
                        $tempParams['noOfRooms'] = count($this->userData['searchParameters']['occupancy']); // $cartData['hotel']['verifyResult']['products']['hotel']['roomResults']['noOfRooms'];
                        if($payWithVirtual) { //use US bank
                            $virtualCard = $this->_setupVccNumber($tempParams, $cartData,$bookingId,$bookingNumber,$transactionID);
                            if($virtualCard == false) {
                                $bookingSuccess = false;
                            }
                        } else { //use faked card
                            $tempParams['paymentInformation']['card'] = '4111111111111111';
                            $tempParams['paymentInformation']['cardType'] = 'VI';
                            
                        }
                            // die('test3');
                        if($bookingSuccess !== false){
                            $hotelData = app('hotelsService')->book($tempParams, $booking->id);
                        }
                        if (isset($hotelData) && !isset($hotelData['error'])) {
                            $cartData['hotel']['bookingResult'] = $hotelData;
                            $bookingSuccess = true;
                            if(isset($virtualCard) && !empty($virtualCard['merchantId'])){
                                $cartData['hotel']['bookingResult']['bookingInfo']['virtualCard'] =  array('merchantId'=>$virtualCard['merchantId']);
                            }
                        } else {
                            $hotelNoError = false;
                            $bookingSuccess = false;
                            $booking->booking_status = 5;
                            if($payWithVirtual){
                                app('virtualCardService')->cancelVirtualCard($virtualCard['merchantId']);
                            }
                        }
                    }

                    $hotelDataForEmail = array_merge($cartData['hotel'], ["searchParameters" => $this->userData['searchParameters']]);
                    $emailData['hotel'] = app('hotelsService')->logBooking($hotelDataForEmail, $booking->id);
                }

                if (isset($cartData['flight'])) {
                    $tempParams = $params;
                    $tempParams['cartId'] = $cartData['flight']['resultId'];
                    $tempParams['sessionId'] = $cartData['flight']['sessionId'];
                    $tempParams['bookingID'] = $booking->id;
                    $tempParams['isPackage'] = (isset($cartData['hotel']) || isset($cartData['car']) ? true : false);
                    $tempParams['refundable'] = $cartData['flight']['refundable'];
                    $flightData = app('flightsService')->book($tempParams, $booking->id);
                    if (!isset($flightData['error'])) {
                        $cartData['flight']['bookingResult'] = $flightData;
                        $bookingSuccess = true;
                    } else {
                        $flightNoError = false;
                        $bookingSuccess = $bookingSuccess === null ? false : $bookingSuccess;
                        $booking->booking_status = 5;
                    }

                    $emailData['flight'] = app('flightsService')->logBooking($cartData['flight'], $booking->id);

                }

                if (isset($cartData['hotel']) && $cartData['hotel']['roomResult']['rateinfo']['pricingInfo']['refundable'] === false && $bookingSuccess !== false) {
                    $tempParams = $params;
                    $hotel = $cartData['hotel']['verifyResult']['products']['hotel']['roomResults'];

                    $tempParams['cost'] = $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'];
                    if(!empty($params['costs']['deposit'])) {
                        $tempParams['cost'] = (($hotel['checkInDate'] < '2021-12-18' || $hotel['checkInDate'] > '2022-01-05') ? $params['costs']['deposit'] : $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['minDeposit']);
                    }

                    $tempParams['base'] = $hotel['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'];
                    $tempParams['paymentInformation']['card'] = '4111111111111111';
                    $tempParams['paymentInformation']['cardType'] = 'VI';
                    $tempParams['paymentInformation']['security'] = '123';
                    $tempParams['cartId'] = $cartData['hotel']['resultId'];
                    $tempParams['sessionId'] = $cartData['hotel']['sessionId'];
                    $tempParams['noOfRooms'] = count($this->userData['searchParameters']['occupancy']);
                    // $tempParams['noOfRooms'] = $cartData['hotel']['verifyResult']['products']['hotel']['roomResults']['noOfRooms'];
                    if($payWithVirtual){
                        $virtualCard = $this->_setupVccNumber($tempParams, $cartData, $bookingId, $bookingNumber, $transactionID);
                        if($virtualCard == false){
                            $hotelNoError = false;
                        }
                    } else { //use faked card
                        $tempParams['paymentInformation']['card'] = '4111111111111111';
                        $tempParams['paymentInformation']['cardType'] = 'VI';
                    }

                    if($hotelNoError){
                        $hotelData = app('hotelsService')->book($tempParams, $booking->id);
                    }

                    if (isset($hotelData) && !isset($hotelData['error'])) {
                        $cartData['hotel']['bookingResult'] = $hotelData;
                        if(isset($virtualCard) && !empty($virtualCard['merchantId'])){
                            $cartData['hotel']['bookingResult']['bookingInfo']['virtualCard'] = array('merchantId' => $virtualCard['merchantId']);
                        }
                        $emailData['hotel'] = app('hotelsService')->updateBookingRecord($cartData['hotel']['bookingResult']['bookingInfo'], $booking->id);
                        $bookingSuccess = true;
                    } else {
                        $hotelNoError = false;
                        $bookingSuccess = $bookingSuccess === null ? false : $bookingSuccess;
                        $booking->booking_status = 5;
                        if($payWithVirtual){
                            app('virtualCardService')->cancelVirtualCard($virtualCard['merchantId']);
                        }
                    }
                }

                if(isset($cartData['car']) && $bookingSuccess) {
                    $tempParams = $params;
                    $tempParams['paymentInformation']['card'] = '4111111111111111';
                    $tempParams['paymentInformation']['cardType'] = 'VI';
                    $tempParams['paymentInformation']['security'] = '123';
                    $tempParams['sessionId'] = $cartData['car']['session']['id'];
                    $tempParams['bookingID'] = $booking->id;
                    $tempParams['isPackage'] = (isset($cartData['hotel']) ? true : false);
                    $tempParams['rateIndex'] = $cartData['car']['rateIndex'];
                    $tempParams['dropfee'] = floatval($cartData['car']['verifyResult']['details']['dropfee']['cad']);
                    $tempParams['checkout'] = $cartData['car']['key'];
                    $carData = app('carsService')->book($tempParams, $booking->id);
                    if (!isset($carData['success'])) {
                        $cartData['car']['bookingResult'] = $carData;
                        $bookingSuccess = true;
                    } else {
                        $carNoError = false;
                        $bookingSuccess = $bookingSuccess === null ? false : $bookingSuccess;
                        $booking->booking_status = 5;
                    }
                    $emailData['car'] = app('carsService')->logBooking($cartData['car'], $booking->id);
                }

                if ($bookingSuccess === null || $bookingSuccess) {
                    if(!empty($params['costs']['choose'])) {
                        foreach ($params['passengerInformation'] as $i => $pax) {
                            if (isset($pax['isPrimary']) && $pax['isPrimary']) {
                                break;
                            }
                        }

                        $tempParams = [
                            'choose' => $this->userData['products']['choose'],
                            'email' => $pax['email'],
                            'name' => $pax['first']. ' ' .$pax['last'],
                        ];

                        $cardExpiry = str_replace(['/','_'],'', trim($params['paymentInformation']['creditCards'][0]['ccExpiry']));
                        $month = substr($cardExpiry,0,2);
                        $year =  intval(substr($cardExpiry,2, strlen($cardExpiry)-2));
                        if($year<99){
                            $year = '20'.$year;
                        }
                        $tempParams['cc'] = [
                            'number' => str_replace("-",'', $params['paymentInformation']['creditCards'][0]['ccNumber']),
                            'expiryMonth' => $month,
                            'expiryYear' => $year,
                            'cvv' => $params['paymentInformation']['creditCards'][0]['ccCVV'],
                        ];

                        $emailData['choose'] = app('chooseService')->purchase($tempParams);
                        app('chooseService')->logBooking($emailData['choose'], $booking->id);
                    }

                    if(!empty($cartData['transfer'])) {
                        $emailData['transfer'] = ['bookingNumber'=>$emailData['hotel']['bookingNumber'], 'totalAmount'=>$this->userData['cartPrices']['transfer']['base']]  ;
                    }
                    $addonNoError = true;
                    $lang = $this->userData['searchParameters']['lang'];
                    $paxs=  $params['passengerInformation'];
                    if(!empty($this->userData['sessionData']['addon']['selectedInfo']['totalAmount'])) {
                        $tempParams =  array(
                            'lang'=>$lang,
                            'sid'=>$sid,
                            'paxs'=>$paxs,
                            'selectInfo'=>$this->userData['sessionData']['addon']['selectedInfo'],
                            'activityAnswers'=>$params['activityAnswers']??null
                        );
                        $addonData = app('addonService')->book($tempParams, $booking->id);
                        foreach($addonData as $prod=>$tmpBookingResult){
                            $cartData[$prod]['bookingResult'] = $tmpBookingResult;
                        }
                        $emailAddonData = app('addonService')->logBooking($addonData, $sid,$paxs, $booking->id);
                        foreach($emailAddonData as $prod=>$tmpEmailResult){
                            $emailData[$prod] = $tmpEmailResult;
                        }
                    } else if(!empty($this->userData['sessionData']['activity']['selectedInfo']['fare'])) {
                        $tempParams =  array(
                            'lang'=>$lang,
                            'sid'=>$sid,
                            'paxs'=>$paxs,
                            'activityAnswers'=>$params['activityAnswers']??null
                        );
                        $cartData['activity']['bookingResult'] = $activityData=  app('activityService')->book($tempParams, $booking->id);
                        $emailActivityData = app('activityService')->logBooking($activityData, $sid,$paxs, $booking->id);
                        $emailData['activity'] = $emailActivityData;
                        if(!(isset($activityData['booking']) && $activityData['booking']['status'] =='CONFIRMED')){
                            $addonNoError = false;
                        } 
                     }
                   
                   //if standalone activity and wrong , should popup error message  
                   if($isStandalone  && isset($emailData['activity']) && !$addonNoError){
                        $booking->booking_status = 5;
                        unset($request);
                        $this->_cancelTransInErrorMode($transactionIds, $cardCosts, $booking->id);
                        $response = [
                            "error" => [
                                "code" => 'B01',
                                "message" => "Activity booking Failed",
                            ],
                        ];
                   } else {
                       if(!empty($cartData['coupon']) && $cartData['coupon']['status'] !== 'error') {
                            $emailData['coupon'] = $cartData['coupon'];
                            app('couponService')->claimCode(["couponCode" => $cartData['coupon']['code'], "bookingNumber" => $booking->booking_number, "product" => $this->userData['searchParameters']['selectedProducts']]);
                        }
                        if(!empty($params['insuranceInformation'])) {
                            $tempParams = $params;
                            $tempParams['tripInformation'] = $this->userData['searchParameters'];
                            $insuranceData = app('insuranceService')->book($tempParams);
                            if(!empty($insuranceData)) {
                                $tempParams['bookingData'] = $insuranceData;
                                $emailData['insurance'] = app('insuranceService')->logBooking($tempParams, $booking->id);
                            }
                        }
                        unset($request);

                        $booking->booking_status = 3;

                        // check for product status no product is considered confirmed, is consisdered confirmed if the status is not pending

                        $emailData['isConfirmed'] = (!(isset($emailData['hotel']) && $emailData['hotel']['status'] === 'pending')); //  && !(isset($emailData['flight']) && $emailData['flight']['status'] === 'pending'));
                        foreach($transactionIds as $idx=>$tranId) {
                           $request = [
                                "transid" => $tranId,
                                "amount" => $cardCosts[$idx],
                                "bookingnum" => $booking->id,
                                'currency' => app('currencyService')->getCurrency(),
                            ];
                            $charge = app('paymentService')->capture($request);
                            if (!$charge['success']) {
                                $emailData['subject'] = "payment collection failed to complete.";
                                $emailData['paymentFailed'] = true;
                                $emailData['payment'] = [
                                    'total' => $cardCosts[$idx],
                                ];
                                Mail::to(config('mail.error_address'))->send(new BookingErrorResponse($emailData));
                            }
                        }

                        $paymentCards = [];
                        foreach($cardTypeNames as $idx=>$cardTypeName){
                            $paymentCards[] = array(
                                "cardType" => $cardTypeName,
                                "cardMask" => substr($cardNumbers[$idx],0,6).'XXXXXXXX'.substr($cardNumbers[$idx],-4),
                                "expiryDate" => $cardExpirys[$idx],
                                "name" => $creditCards[$idx]['ccName'],
                                'amount'=>$cardCosts[$idx],
                            );
                        }
                        $emailData['payment'] = [
                            "paymentMethod"=>$params['paymentInformation']['paymentMethod'],
                            "reaTtotal" => $cost,
                            "total" => $params['costs']['total'],
                            "currency" => config('app.currency'),
                          //  "name" => $params['paymentInformation']['holder'],
                            "subTotal" => 0,
                            "taxes" => 0,
                            "basePer" => 0,
                            "taxesPer" => 0,
                            "paymentCards"=>$paymentCards,
                        ];

                        if(isset($emailData['hotel'])) {
                            $emailData['payment']['subTotal'] += $emailData['hotel']['subTotal'];
                            $emailData['payment']['taxes'] += $emailData['hotel']['taxes'];
                            $emailData['payment']['basePer'] += ($emailData['hotel']['subTotal'] / count($emailData['passengers']));
                            $emailData['payment']['taxesPer'] += ($emailData['hotel']['taxes'] / count($emailData['passengers']));
                        }

                        if(isset($emailData['flight'])) {
                            $emailData['payment']['subTotal'] += $emailData['flight']['subTotal'];
                            $emailData['payment']['taxes'] += $emailData['flight']['taxes'];
                            $emailData['payment']['basePer'] += ($emailData['flight']['subTotal'] / count($emailData['passengers']));
                            $emailData['payment']['taxesPer'] += ($emailData['flight']['taxes'] / count($emailData['passengers']));
                        }

                        if(isset($emailData['car'])) {
                            $emailData['payment']['subTotal'] += $emailData['car']['subTotal'];
                            $emailData['payment']['taxes'] += $emailData['car']['taxes'];
                            $emailData['payment']['basePer'] += ($emailData['car']['subTotal'] / count($emailData['passengers']));
                            $emailData['payment']['taxesPer'] += ($emailData['car']['taxes'] / count($emailData['passengers']));
                        }


                        if(!empty($params['costs']['deposit'])) {
                            $emailData['payment']['deposit'] = $params['costs']['deposit'];
                            $date = new \DateTime($this->userData['searchParameters']['depDate']);
                            $date->sub(new \DateInterval('P'.config('features.deposit_date').'D'));
                            $dueDate = $date->format('Y-m-d');
                            if($dueDate < date("Y-m-d")){
                                $dueDate = date("Y-m-d");
                            }
                            $emailData['payment']['balanceDueDate'] = $dueDate;
                        }

                        if(!empty($params['paymentInformation']['airmiles'])) {
                            $emailData['payment']["airmilesCard"] = $params['paymentInformation']['airmiles'];
                        }

                        if(!empty($params['paymentInformation']['petroInformation']['petroCard'])) {
                            $base = $emailData['payment']['subTotal'] + (!empty($emailData['insurance']) ? $emailData['insurance']['subTotal'] : 0);
                            $emailData['payment']['petro'] = $params['paymentInformation']['petroInformation'];
                            $emailData['payment']['petro']['total'] = ($base - $params['paymentInformation']['petroInformation']['redeemDollarAmount']) * 10;
                            $emailData['payment']['petro']['base'] = ($base - $params['paymentInformation']['petroInformation']['redeemDollarAmount']) * 10;
                            $emailData['payment']['petro']['bonus'] = 0;
                            $emailData['payment']['petro']['redeem'] = $params['paymentInformation']['petroInformation']['redeemDollarAmount'] * 1000;
                        }

                        $emailData['trip'] = [
                            "departureDate" => $this->userData['searchParameters']['depDate'],
                            "returnDate" => $this->userData['searchParameters']['retDate'],
                            "originCity" => $this->userData['searchParameters']['departure']['text'] ?? '',
                            "originCode" => $this->userData['searchParameters']['departure']['value'] ?? '',
                            "destinationCity" => $this->userData['searchParameters']['destination']['text'],
                            "destinationCode" => $this->userData['searchParameters']['destination']['value'],
                        ];

                        $emailData['emailCode'] = md5($booking->id . $booking->booking_number . $emailData['contact']['email']);

                        $emailRecord = new EmailData;

                        $emailRecord->booking_id = $booking->id;
                        $emailRecord->locale = $this->userData['searchParameters']['lang'];
                        $emailRecord->email_data = json_encode($emailData);
                        $emailRecord->email = $emailData['contact']['email'];
                        $emailRecord->code = $emailData['emailCode'];
                        $emailRecord->save();

                    if (config('site.site') === 'copolo' && !is_null($profile) && empty($profile['error'])) {
                        $productType = (strlen($this->userData['searchParameters']['selectedProducts']) > 1 ? 3 : 2);
                        $userBooking = new CopoloUserBookings;

                        $userBooking->userId = $profile['userID'];
                        $userBooking->itineraryNumber = $booking->booking_number;
                        $userBooking->bookingName = ($productType == 3 && !empty($this->userData['searchParameters'['departure']]) ? $this->userData['searchParameters']['departure']['text2']. ' To ' : '').$this->userData['searchParameters']['destination']['text'];
                        $userBooking->startDate = $this->userData['searchParameters']['depDate'];
                        $userBooking->endDate = $this->userData['searchParameters']['retDate'];
                        $userBooking->URL = "https://".config('app.url')."/emails/confirmation/".$booking->id."/".$emailData['emailCode'];
                        $userBooking->bookingType = $productType;

                        $userBooking->save();
                    }

                    $this->translateConfirmationData($emailData);

                        if (config('accertify.enabled') && isset($accertifyDetailsPrecall)) {
                            $accertifyArgs = [
                                'userData' => $this->userData,
                                'params' => $params,
                                'preCall' => false,
                                'cartData' => $cartData,
                                'productCode' => $this->userData['searchParameters']['selectedProducts'],
                                'bookingNumber' => $bookingNumber,
                            ];
                            $accertifyDetails = app('accertifyService')->status($accertifyArgs);
                            // append the accertify details to the email data
                            // This way the email can render the accertify bit in the subject for internal
                            $emailData['accertifyDetails'] = [];
                            $emailData['accertifyDetails']['postCall'] = $accertifyDetails;
                            $emailData['accertifyDetails']['preCall'] = $accertifyDetailsPrecall;
                        }

                        if($emailData['isConfirmed'] && env("SITE_KEY") ==='hsbc'
                                && $this->userData['searchParameters']['selectedProducts'] ==='H') {
                              $emailData['hsbc_order_detail'] =  app('memberService')->placeOrder($sid, $params['paymentInformation']['redeemAmount'],json_encode($emailData));
                        }
                        // after post accertify - then email the confirmation
                        $email = new ConfirmationResponse($emailData, 'customer');
                        // send to customer
                        Mail::to($params['passengerInformation'][0]['email'])->send($email);
                        // build internal email
                        $internalEmail = new ConfirmationResponse($emailData, 'internal');
                        // send to internal recipients
                        Mail::to(config('mail.internal_address'))->send($internalEmail);
                        
                        if(isset($this->userData['searchParameters']['selectedProducts']) && !empty($this->userData['searchParameters']['selectedProducts']) && $this->userData['searchParameters']['selectedProducts']=="H" ){
                            $response = route('hotel-confirmation');
                        }else if(isset($this->userData['searchParameters']['selectedProducts']) && !empty($this->userData['searchParameters']['selectedProducts']) && $this->userData['searchParameters']['selectedProducts']=="FH" ){
                            $response = route('flight-hotel-confirmation');
                        }else{
                            $response = route('confirmation');
                        }
                        
                        if(!$hotelNoError || !$flightNoError || !$carNoError) {
                            if (!$hotelNoError) {
                                $emailData['subject'] = 'Hotel failed to book.';
                                if (isset($hotelData['error']['message']['dump']) && isset($hotelData['error']['message']['dump']['reservationStatusCode']) && $hotelData['error']['message']['dump']['reservationStatusCode'] === 'PS') {
                                    $emailData['subject'] = "Pending Hotel booking.";
                                }

                                $this->userData['confirmationError'] = true;
                                $this->userData['confirmationErrorType'] = 'hotel';
                            }

                            if (!$flightNoError) {
                                $emailData['subject'] = 'Flight failed to book.';
                                $this->userData['confirmationError'] = true;
                                $this->userData['confirmationErrorType'] = 'flight';
                            }

                            if (!$carNoError) {
                                $emailData['subject'] = 'Car failed to book.';
                                $this->userData['confirmationError'] = true;
                                $this->userData['confirmationErrorType'] = 'car';
                            }

                            if (!empty($emailData['flights'])) {
                                // $emailData['issue'] = true;

                                // $intairEmail = new IntairMessage($emailData);
                                // // Mail::to('albert@redtag.ca', 'travel@travelbrands.com')->send($intairEmail);
                            }
                            $errorEmail = new BookingErrorResponse($emailData);
                            Mail::to(config('mail.error_address'))->send($errorEmail);
                        } 
                   }
                } else {
                    $booking->booking_status = 5;
                    unset($request);
                    $this->_cancelTransInErrorMode($transactionIds, $cardCosts, $booking->id);
                    $response = [
                        "error" => [
                            "code" => 'B01',
                            "message" => "booking Failed",
                        ],
                    ];
                }
                $booking->save();
            } else {
                // payment hold failed, no funds available?
                $this->userData['confirmationError'] = true;
                $this->userData['confirmationErrorType'] = 'payment';
                $response = [
                    "error" => [
                        "code" => 'B02',
                        "message" => "Payment Failed",
                    ],
                ];
            }
        } else {
            $response = $this->userData;
        }

        Cache::put($sid, $this->userData, 1800);
        return $response;
    }

    public function checkProduct($sid, $params, $product)
    {
        if ($product === 'coupon') {
            $params['cost'] = 0;
            $baseCost = 0;
            foreach ($this->userData['activePrices'] as $product => $price) {
                if($product !== 'cooupon') {
                    $params['cost'] += $price['base'] + $price['taxes'];
                    $baseCost += $price['base'];
                }
            }
            $params['baseCostPer'] = $baseCost / $this->calcTravellers();
            $params['costPer'] = $params['cost'] / $this->calcTravellers();

            $returnData = app('couponService')->checkCode($params);
        } else if ($product === 'choose') {
            $numPassengers = $this->calcTravellers();
            if(!empty($params['flightID']) || !empty($this->userData['activePrices']['flight'])) {
                $itineraries = $params['flightID'] ?? $this->userData['activePrices']['flight']['itineraries'];

                $data = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);
                $flight = app('flightsService')->details($data, $itineraries);

                foreach ($flight as $slice) {
                    $legs = [];
                    foreach ($slice['segments'] as $index => $leg) {
                        $legs[] = [
                            "flightNumber"          => $leg['flight']['number'],
                            "departureCode"         => $leg['origin'],
                            "departureDatetime"     => substr($leg['legs'][0]['departure'], 0, -6),
                            "destinationCode"       => $leg['destination'],
                        ];
                    }

                    $flights['flight'][] = [
                        "legs" => $legs,
                    ];
                }

                if (config('features.choose')) {
                    $returnData = app('chooseService')->getCarbonRate(
                        [
                            'product' => 'flight',
                            'segments' => $flights['flight'],
                            'class' => 'Y'
                        ], $numPassengers);
                }
            } else {
                // $returnData = ["error" => ["message" => "rate unavailable"]];
                $startDate = new \DateTime($this->userData['searchParameters']['depDate']);
                $endDate = new \DateTime($this->userData['searchParameters']['retDate']);
                $numNights = $startDate->diff($endDate);
                if (config('features.choose')) {
                    $returnData = app('chooseService')->getCarbonRate(
                        [
                            'product' => 'hotel',
                            'nights' => intval($numNights->format('%d')),
                            'rooms' => count($this->userData['searchParameters']['occupancy']),
                        ], $numPassengers);
                }
            }
        } else if ($product === 'hotel-topic-review') {
            $reviews = $this->packageRepo->hotelReviews($params);

            $response = [
                'reviews' => [],
                'hasMore' => (($reviews['pageNumber'] + 1) * $reviews["pageSize"] <= $reviews['totalItems']),
            ];

            foreach ($reviews['items'] as $item) {
                $response['reviews'][] = $item['body'];
            }

            return $response;
        }

        return $returnData;
    }

    public function checkProducts($sid)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            $crumbs = [];
            if (isset($userData['inCart']['hotels'])) {
                $crumbs['hotel'] = $userData['inCart']['hotels'];
            }
            if (isset($userData['inCart']['flights'])) {
                $crumbs['flight'] = !empty($userData['searchParameters']['refundable']) ? 'hide' : $userData['inCart']['flights'];
            }
            if (isset($userData['inCart']['cars'])) {
                $crumbs['car'] = $userData['inCart']['cars'];
            }
             if (isset($userData['inCart']['activities'])) {
                $crumbs['activity'] = $userData['inCart']['activities'];
            }

            return $crumbs;
        } else {
            return $userData;
        }
    }

    public function getConfrmationData($bookingID = null, $emailCode = null)
    {
        if($bookingID === null){
            $bookingID = $this->userData['bookingID'];
        }
        $emailQuery = EmailData::where('booking_id', $bookingID);
        if($emailCode !== null) {
            $emailQuery->where('code', $emailCode);
        }
        $emailRecord = $emailQuery->get()
            ->first();
        if (is_null($emailRecord)) {
            abort(403);
        }
        \App::setLocale($emailRecord->locale);
        $emailData = json_decode($emailRecord->email_data, true);

        $this->translateConfirmationData($emailData);
        return $emailData;
    }

    public function translateConfirmationData(&$emailData)
    {
        $dateFormat = 'D. F j, Y';
        $timeFormat = 'h:i A';
        $emailData['bookingDateTime'] = new \DateTime($emailData['bookingDate']);
        $emailData['isStandalone'] = !array_key_exists('flight', $emailData);
        $emailData['insuranceTotal'] = 0;
        $emailData['hasOpc'] = false;
        if (!$emailData['isStandalone']) {
            foreach ($emailData['flight']['itineraries'] as &$itinerary) {
                foreach($itinerary['segments'] as &$segment) {
                    $flightDeparture = \Carbon\Carbon::parse($segment['departureDatetime']);
                    $flightArrival = \Carbon\Carbon::parse($segment['arrivalDatetime']);
                    $segment['depDate'] = $flightDeparture->format($dateFormat);
                    $segment['arrDate'] = $flightArrival->format($dateFormat);
                    $segment['depTime'] = $flightDeparture->format($timeFormat);
                    $segment['arrTime'] = $flightArrival->format($timeFormat);
                }
            }


            $emailData['hasInsurance'] = (!empty($emailData['insurance']) && count(array_keys($emailData['insurance']['passengers'])));
            $emailData['hasAdditionalOptions'] = $emailData['hasFlightOptions'] = $emailData['hasBaggageInfo'] = false;
            if ($emailData['hasInsurance']) {
                $emailData['insuranceTotal'] = $emailData['insurance']['total'];
            }
        } else {
            $emailData['hasInsurance'] = false;
        }

        if(!empty($emailData['payment']['depositDate'])){
            $emailData['payment']['depositDate'] = date('j F, Y', strtotime($emailData['payment']['depositDate']));
        }

        if(isset($emailData['hotel'])){
            $emailData['hotel']['checkIn'] = date($dateFormat, strtotime($emailData['hotel']['checkIn']));
            $emailData['hotel']['checkOut'] = date($dateFormat, strtotime($emailData['hotel']['checkOut']));
        }
        $emailData['passengerCount'] = count($emailData['passengers']);
        if(isset($emailData['trip'])){
            $emailData['departDate'] = new \DateTime($emailData['trip']['departureDate']);
            $emailData['returnDate'] = new \DateTime($emailData['trip']['returnDate']);
            $diff = $emailData['departDate']->diff($emailData['returnDate']);
            $emailData['trip']['duration'] = $diff->days;
        }
    }

    public function getSessionData($sid)
    {
        if($this->userData === null) {
            $this->userData = Cache::get($sid);

            if ($this->userData === null) {
                return [
                    "error" => [
                        "code" => "s-01",
                        "message" => "Your booking session has expired would you like to restart?"
                    ]
                ];
                // return $this->userData;
            }

            \App::setLocale($this->userData['searchParameters']['lang'] ?? 'en');
        }
        return true;
    }

    public function getBookings()
    {
        $bookingsData = DB::table('booking')
            ->join('email_data', 'booking.id', '=', 'email_data.booking_id')
            ->join('booking_status', 'booking.booking_status', '=', 'booking_status.id')
            ->select('booking.id', 'booking.booking_number', 'email_data.email_data', 'booking_status.status', 'booking.merged')
            ->orderBy('booking.create_time', 'ASC')
            ->get();

        $data = [];
        foreach ($bookingsData as $booking) {
            $status = $booking->status;
            $emailData = json_decode($booking->email_data, true);
            $products = [
                'hotel' => isset($emailData['hotel']),
                'flight' => isset($emailData['flight']),
            ];

            $data[] = [
                "created" => date('m/d/Y', strtotime($emailData['bookingDate'])),
                "bookingNum" => $booking->booking_number,
                "name" => $emailData['contact']['first'] . ' ' . $emailData['contact']['last'],
                "products" => $products,
                "price" => $emailData['payment']['total'],
                "status" => $status,
                "id" => $booking->id,
                "merge" => !$booking->merged,
            ];
        }

        return $data;
    }

    public function getCurrency()
    {
        return $this->userData['currency'];
    }

    public function getBooking($bookingID)
    {
        $booking = Booking::where('id', $bookingID)->get()->first();

        $email = $booking->emailData;
        $emailData = json_decode($email->email_data, true);

        $data = [
            "bookingNumber" => $booking->booking_number,
            "contact" => [
                "name" => $emailData['contact']['first'] . ' ' . $emailData['contact']['last'],
                "address" => $emailData['contact']['address'],
                "city" => $emailData['contact']['city'],
                "country" => $emailData['contact']['country'],
                "postalCode" => $emailData['contact']['postal'],
                "email" => $emailData['contact']['email'],
                "phone" => $emailData['contact']['phoneNumber'],
            ],
            "payment" => [
                "subTotal" => isset($emailData['payment']['subTotal']) ? $emailData['payment']['subTotal'] : 0,
                "taxes" => isset($emailData['payment']['taxes']) ? $emailData['payment']['taxes'] : 0,
                "total" => isset($emailData['payment']['total']) ? $emailData['payment']['total'] : 0,
            ]
        ];

        if (isset($emailData['hotel'])) {
            $data['hotel'] = [
                "bookingNumber" => $emailData['hotel']['bookingNumber'],
                "name" => $emailData['hotel']['name'],
                "address" => $emailData['hotel']['address'],
                "checkIn" => $emailData['hotel']['checkIn'],
                "checkOut" => $emailData['hotel']['checkOut'],
                "roomCategory" => $emailData['hotel']['roomType'],
                "subTotal" => $emailData['hotel']['subTotal'],
                "taxes" => $emailData['hotel']['taxes'],
                "total" => $emailData['hotel']['total']
            ];
        }

        if (isset($emailData['flight'])) {
            $data['flight'] = [
                "bookingNumber" => $emailData['flight']['bookingNumber'],
                'departure' => [
                    "departureLocation" => $emailData['flight']['itineraries'][0]['originCode'] . ' - ' . $emailData['flight']['itineraries'][0]['originCity'],
                    "departureAriport" => $emailData['flight']['itineraries'][0]['originAirport'],
                    "departTime" => date('g:iA', strtotime($emailData['flight']['itineraries'][0]['departureDateTime'])),
                    "departDate" => date('j M Y', strtotime($emailData['flight']['itineraries'][0]['departureDateTime'])),
                    "travelTime" => $emailData['flight']['itineraries'][0]['flightTime'],
                    "arrivalLocation" => $emailData['flight']['itineraries'][0]['destinationCode'] . ' - ' . $emailData['flight']['itineraries'][0]['destinationCity'],
                    "arrivalAirport" => $emailData['flight']['itineraries'][0]['destinationAirport'],
                    "arrivalTime" => date('g:iA', strtotime($emailData['flight']['itineraries'][0]['arrivalDateTime'])),
                    "arrivalDate" => date('j M Y', strtotime($emailData['flight']['itineraries'][0]['arrivalDateTime'])),
                ],
                "subTotal" => $emailData['flight']['subTotal'],
                "taxes" => $emailData['flight']['taxes'],
                "total" => $emailData['flight']['total'],
                "passengers" => $emailData['flight']['passengers']
            ];

            if (isset($emailData['flight']['itineraries'][1])) {
                $data['flight']['return'] = [
                    "departureLocation" => $emailData['flight']['itineraries'][1]['originCode'] . ' - ' . $emailData['flight']['itineraries'][1]['originCity'],
                    "departureAriport" => $emailData['flight']['itineraries'][1]['originAirport'],
                    "departTime" => date('g:iA', strtotime($emailData['flight']['itineraries'][1]['departureDateTime'])),
                    "departDate" => date('j M Y', strtotime($emailData['flight']['itineraries'][1]['departureDateTime'])),
                    "travelTime" => $emailData['flight']['itineraries'][1]['flightTime'],
                    "arrivalLocation" => $emailData['flight']['itineraries'][1]['destinationCode'] . ' - ' . $emailData['flight']['itineraries'][1]['destinationCity'],
                    "arrivalAirport" => $emailData['flight']['itineraries'][1]['destinationAirport'],
                    "arrivalTime" => date('g:iA', strtotime($emailData['flight']['itineraries'][1]['arrivalDateTime'])),
                    "arrivalDate" => date('j M Y', strtotime($emailData['flight']['itineraries'][1]['arrivalDateTime'])),
                ];
            }
        }

        return $data;
    }

    public function getProduct($product=null)
    {
        if(empty($product)){
            return $this->userData['products'];
        } else {
            return $this->userData['products'][$product]??[];
        }
    }

    private function calcTravellers($responseType = 'number')
    {
        $numPassengers = 0;

        $pax = [ "adults" => 0, "children" => 0];

        foreach ($this->userData['searchParameters']['occupancy'] as $room) {
            $numPassengers += $room['adults'];

            $children = array_filter($room['ages'], function($v) {
                return $v >= 2;
            });

            $numPassengers += count($children);

            $pax['adults'] += $room['adults'];
            $pax['children'] += $room['children'];
        }

        return $responseType === 'number' ? $numPassengers : $pax;
    }

    private function getProducts($sid, $product)
    {
        $numPassengers = $this->calcTravellers();

        $products = [];

        if(strpos($this->userData['searchParameters']['selectedProducts'], 'H') !== false && (!isset($this->userData['sessionData']['hotels']) || !Cache::has("htl-".$this->userData['sessionData']['hotels']['sessionID']))) {
            $products[] = 'hotels';
        }

        if(strpos($this->userData['searchParameters']['selectedProducts'], 'F') !== false && (!isset($this->userData['sessionData']['flights']) || !Cache::has('ft-'.$this->userData['sessionData']['flights']['sessionID']))) {
            $products[] = 'flights';
        }

        if(strpos($this->userData['searchParameters']['selectedProducts'], 'C') !== false && !isset($this->userData['sessionData']['cars'])) {
            $products[] = 'cars';
        }

        list($results, $transferTimes) = $this->packageRepo->search($this->userData['searchParameters'], $products);

        // dd($results);
        // $requestLog = new RequestLog;

        // $requestLog->sessionID = $sid;
        // $requestLog->hotelResponse = (string)$transferTimes['hotel'];
        // $requestLog->flightResponse = (string)$transferTimes['flight'];
        // $requestLog->startTime = $transferTimes['start'];
        // $requestLog->endTime = $transferTimes['end'];

        // $requestLog->save();

        $markupHelper = new MarkupHelper($this->userData['cartID']);

        if (!isset($this->userData['activePrices'])) {
            $this->userData['activePrices'] = [];
        }
        if (!isset($this->userData['cartPrices'])) {
            $this->userData['cartPrices'] = [];
        }

        if (!empty($results['flights']) || !empty($results['flights-refundable'])) {
            $hasRefundable = !empty($results['flights-refundable']) && !isset($results['flights-refundable']['error']) && !empty($results['flights-refundable']['data']['flightResults']['rows']);
            if (!empty($results['flights']['error'])) {
                return $results['flights'];
            }

            if($hasRefundable) {
                $results['flights'] = app('flightsService')->mergeResults($results['flights'] ?? null, $results['flights-refundable']);
            }
            // dd($results['flights']);

            if (empty($results['flights']['data']['flightResults']['rows'])) {
                return ["error" => ["code" => 'r01', "message" => "There are no results available."]];
            }

            if($this->userData['currency'] !== 'CAD') {
                $results['flights'] = app('flightsService')->searchCurrencyConversion($results['flights'], $this->userData['currency']);
            }

            if (!empty($results['flights.markup'])) {
                $results['flights'] = $markupHelper->applyFlightsMarkup($results['flights.markup'], $results['flights'], $numPassengers);
            }

            Cache::put('ft-'.$results['flights']['data']['session']['id'], $results['flights'], 1800);
            $fare = $results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleTotal']['amount'];
            $base = floatval($results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleFareTotal']['amount']) * $numPassengers;
            $taxes = floatval($results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleTaxTotal']['amount']) * $numPassengers;
            $itineraries = $results['flights']['data']['flightResults']['rows'][0]['itineraries'];

            foreach ($results['flights']['data']['flightResults']['rows'] as $rowID =>$row) {
                if(isset($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][0]]['segments']) && count($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][0]]['segments']) === 1
                    && isset($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][1]]['segments']) && count($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][1]]['segments']) === 1
                    && $row['priceInfo']['cheapest']['saleTotal']['amount'] <= $fare
                ) {
                    $fare = $row['priceInfo']['cheapest']['saleTotal']['amount'];
                    $base = floatval($row['priceInfo']['cheapest']['saleFareTotal']['amount']) * $numPassengers;
                    $taxes = floatval($row['priceInfo']['cheapest']['saleTaxTotal']['amount']) * $numPassengers;
                    $itineraries = $row['itineraries'];
                    break;
                }
            }

            $this->userData['activePrices']['flight'] = ["fare" => $fare, "base" => $base, "taxes" => $taxes, 'itineraries' => $itineraries];
            $this->userData['cartPrices']['flight'] = $this->userData['activePrices']['flight'];

            $this->userData['sessionData']['flights'] = [
                "sessionID" => $results['flights']['data']['session']['id'],
                "resultsID" => $results['flights']['data']['flightResults']['resultsID'],
            ];

            if($hasRefundable) {
                $this->userData['sessionData']['flights']["refundableSessionID"] = $results['flights-refundable']['data']['session']['id'];
                $this->userData['sessionData']['flights']["refundableResultsID"] = $results['flights-refundable']['data']['flightResults']['resultsID'];
            }

            $refundablePath  = $this->userData['searchParameters']['refundable']??0;
            if($refundablePath) {
                $data = [
                    'type' => 'flight',
                    'refundable' => true,
                    'rowId' => $results['flights']['data']['flightResults']['rows'][0]['id'],
                    'sessionData' => $this->userData['sessionData']['flights'],
                ];
                $this->addProduct($sid, $data, 'flight');

                $destCode =  $this->userData['searchParameters']['destination']['value'];
                if(in_array($destCode, config('features.default_transfer_dest'))){
                    $paxInfo = $this->calcTravellers('pax');
                    $priceConfig = config('features.default_transfer_price')[$destCode];
                    $calcAveragePrice = ($priceConfig[0]*$paxInfo['adults'] + $priceConfig[1]*$paxInfo['children'])/$numPassengers;
                    $data = [
                        'type' => 'transfer',
                        'content'=>[ 'value' => $calcAveragePrice ],
                    ];
                    $this->addProduct($sid, $data, 'transfer');
                }
            }
        }

        if (!empty($results['hotels'])) {
            if (!empty($results['hotels']['error'])) {
                return $results['hotels'];
            }
            if (empty($results['hotels']['data']['hotelResults']['rows'])) {
                return ["error" => ["code" => 'r01', "message" => "There are no results available."]];
            }
            if (!empty($results['hotels.markup'])) {
                $results['hotels'] = $markupHelper->applyHotelsMarkup($results['hotels.markup'], $results['hotels']);
                Cache::put('htl-markup-' . $this->userData['cartID'], $results['hotels.markup'], 5400);
            }

			if(isset($this->userData['searchParameters']['hotelSearch']) && !empty($this->userData['searchParameters']['hotelSearch'])){
                $finalRows = $this->filterHotelBySearch($results['hotels']['data']['hotelResults']['rows']);
                $results['hotels']['data']['hotelResults']['totalResults'] = count($finalRows);
                $results['hotels']['data']['hotelResults']['rows'] = $finalRows;
            }
            
            Cache::put("htl-".$results['hotels']['data']['session']['id'], $results['hotels']['data']['hotelResults'], 1800);
            $this->userData['sessionData']['hotels'] = [
                "sessionID" => $results['hotels']['data']['session']['id'],
                "resultsID" => $results['hotels']['data']['hotelResults']['resultsId']
            ];

            $saveSearch = $this->userData['searchParameters'];
            $saveSearch['hotelSearch'] = '';

            if($this->userData['searchParameters']['selectedProducts'] == 'H'){
                $deals = $results['hotels']['data']['hotelResults'];
                $deals['rows'] = array_slice($deals['rows'], 0, 20);
                $prices = ['hotel' => []];
                $dealResults = app('hotelsService')->translateSearch($deals, $prices, false, $numPassengers, true);

                app('dealsService')->insertHotelDeals($dealResults, $saveSearch);
            } else {
                $deals = $results['hotels']['data']['hotelResults'];
                $deals['rows'] = array_slice($deals['rows'], 0, 20);
                $prices = ['hotel' => [], 'flight' => $this->userData['activePrices']['flight']];
                $dealResults = app('hotelsService')->translateSearch($deals, $prices, false, $numPassengers, false);

                $flights = \Cache::get('ft-'.$this->userData['sessionData']['flights']['sessionID']);
                $flightKey = $flights['data']['flightResults']['rows'][0]['itineraries'][0];
                $flightRecord = $flights['data']['flightResults']['extras']['slices'][$flightKey];
                $originCode = $flightRecord['segments'][0]['origin'];
                $destinationCode = end($flightRecord['segments'])['destination'];
                $origin = $flights['data']['flightResults']['extras']['airports'][$originCode]['city'];
                $destination = $flights['data']['flightResults']['extras']['airports'][$destinationCode]['city'];

                foreach ($dealResults['hotels'] as &$deal) {
                    $deal['origin'] = $origin;
                    $deal['destination'] = $destination;
                }

                // dd($dealResults);
                app('dealsService')->insertDynamicDeals($dealResults, $saveSearch);
            }
        }

        if (!empty($results['cars'])) {
            if ($product === 'cars' && !empty($results['cars']['error'])) {
                return $results['cars'];
            }

            Cache::put('car-'.$results['cars']['session']['id'], $results['cars']['carResults'], 1800);
            $carRates = $results['cars']['carResults']['rows'][0]['rates'][0];
            $fare = $carRates['total'] / $numPassengers;
            $base = $carRates['total'] - $carRates['tax'];
            $taxes = $carRates['tax'];

            $this->userData['activePrices']['car'] = ["fare" => intval($fare), "base" => $base, "taxes" => $taxes];
            $this->userData['cartPrices']['car'] = $this->userData['activePrices']['car'];

            $this->userData['sessionData']['cars'] = [
                "sessionID" => $results['cars']['session']['id'],
            ];
        }
        return true;
    }

    public function filterHotelBySearch($rows) {
        $hotelIds = [];
        $finalHotels = [];
        foreach($rows as $item){
            array_push($hotelIds,$item['pricelineId']);
        }
        $response = $this->packageRepo->filterHotelBySearch($hotelIds,$this->userData['searchParameters']);
        if(!isset($response['error'])){
            foreach($response['items'] as $item){
                foreach($rows as $hotelItem){
                    if($hotelItem['pricelineId'] == $item['clientRefId']){
                        $hotelItem['extras']['divinia'] = $item;
                        array_push($finalHotels,$hotelItem);
                        break;
                    }
                }
            }
        }
        return $finalHotels;
    }

    private function updateHotelSearch($date)
    {
        $data = \Cart::remove($this->userData['cartID'], 'hotel');

        $this->userData['searchParameters']['depDateHotel'] = $date;
        $this->userData['searchParameters']['retDateHotel'] = $this->userData['searchParameters']['retDateHotel'] ?? $this->userData['searchParameters']['retDate'];
        $this->userData['searchParameters']['customHotelDates'] = true;

        unset($this->userData['sessionData']['hotels']);
        $this->userData['inCart']['hotels'] = false;
    }

    private function getHotel($id)
    {
        $vendor = 'TN';
        if(isset($this->userData['products']['hotel'])) {
            if($this->userData['products']['hotel']['vendor'] === 'PPN') {
                $vendor = 'P';
            } else if ($this->userData['products']['hotel']['vendor'] === 'TTS') {
                $vendor = 'TT';
            }
        }

        $products = [];

        if(strpos($this->userData['searchParameters']['selectedProducts'], 'F') !== false && !isset($this->userData['sessionData']['flights'])) {
            $products[] = 'flights';
        }

        $searchParameters = $this->userData['searchParameters'];
        $params = [
            'hotelID' => $id,
            'occupancy' => $searchParameters['occupancy'],
            'depDate' => $searchParameters['depDateHotel'] ?? $searchParameters['depDate'],
            'retDate' => $searchParameters['retDateHotel'] ?? $searchParameters['retDate'],
            'vendor' => $searchParameters['vendor'] ?? $vendor,
            'selectedProducts' => $searchParameters['selectedProducts'],
            'destination' => $searchParameters['destination'] ?? [],
            'departure' => $searchParameters['departure'] ?? [],
            'trip' => $searchParameters['trip'] ?? '',
            'cabinType' => $searchParameters['cabinType'] ?? '',
            'refundable' => $searchParameters['refundable'] ?? false,
            'lang' => \App::getLocale(),
        ];

        $results = $this->packageRepo->hotelDeal($params, $products);

        if (!empty($results['flights'])) {
            $markupHelper = new MarkupHelper($this->userData['cartID']);
            $numPassengers = $this->calcTravellers();

            if (!empty($results['flights']['error'])) {
                return $results['flights'];
            }
            if (empty($results['flights']['data']['flightResults']['rows'])) {
                return ["error" => ["code" => 'r01', "message" => "There are no results available."]];
            }

            if (!empty($results['flights.markup'])) {
                $results['flights'] = $markupHelper->applyFlightsMarkup($results['flights.markup'], $results['flights'], $numPassengers);
            }
            Cache::put('ft-'.$results['flights']['data']['session']['id'], $results['flights'], 1800);
            $fare = $results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleTotal']['amount'];
            $base = floatval($results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleFareTotal']['amount']) * $numPassengers;
            $taxes = floatval($results['flights']['data']['flightResults']['rows'][0]['priceInfo']['cheapest']['saleTaxTotal']['amount']) * $numPassengers;
            $itineraries = $results['flights']['data']['flightResults']['rows'][0]['itineraries'];

            foreach ($results['flights']['data']['flightResults']['rows'] as $rowID =>$row) {
                if(isset($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][0]]['segments']) && count($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][0]]['segments']) === 1
                    && isset($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][1]]['segments']) && count($results['flights']['data']['flightResults']['extras']['slices'][$row['itineraries'][1]]['segments']) === 1
                    && $row['priceInfo']['cheapest']['saleTotal']['amount'] <= $fare
                ) {
                    $fare = $row['priceInfo']['cheapest']['saleTotal']['amount'];
                    $base = floatval($row['priceInfo']['cheapest']['saleFareTotal']['amount']) * $numPassengers;
                    $taxes = floatval($row['priceInfo']['cheapest']['saleTaxTotal']['amount']) * $numPassengers;
                    $itineraries = $row['itineraries'];
                    break;
                }
            }

            $this->userData['activePrices']['flight'] = ["fare" => intval($fare), "base" => $base, "taxes" => $taxes, 'itineraries' => $itineraries];
            $this->userData['cartPrices']['flight'] = $this->userData['activePrices']['flight'];

            $refundablePath  = $this->userData['searchParameters']['refundable']??0;
            if($refundablePath) {
                $data = [
                    'type' => 'flight',
                    'refundable' => true,
                    'rowId' => $results['flights']['data']['flightResults']['rows'][0]['id'],
                    'sessionID' => $results['flights']['data']['session']['id'],
                ];
                $this->addProduct($this->userData['sid'], $data, 'flight');

                $destCode =  $this->userData['searchParameters']['destination']['value'];
                if(in_array($destCode, config('features.default_transfer_dest'))){
                    $paxInfo = $this->calcTravellers('pax');
                    $priceConfig = config('features.default_transfer_price')[$destCode];
                    $calcAveragePrice = ($priceConfig[0]*$paxInfo['adults'] + $priceConfig[1]*$paxInfo['children'])/$numPassengers;
                    $data = [
                        'type' => 'transfer',
                        'content'=>[ 'value' => $calcAveragePrice ],
                    ];
                    $this->addProduct($this->userData['sid'], $data, 'transfer');
                }
            }

            $this->userData['sessionData']['flights'] = [
                "sessionID" => $results['flights']['data']['session']['id'],
            ];
        }

        if(empty($results['hotel']['error'])) {
            Cache::put('htl-markup-' . $this->userData['cartID'], $results['hotels.markup'], 1800);
            $this->userData['sessionData']['hotels']["sessionID"] = $results['hotel']['data']['session']['id'];
            $this->userData['sessionData']['hotels']["resultsID"] = $results['hotel']['data']['resultsId'];
        } else {
            $results = $results['hotel'];
        }

        $this->userData['products']['hotel']['hotelId'] = $id;
        return $results;
    }

    private function updateCarsSearch($flightData)
    {
        // dd($flightData);
        $arrivalData = end($flightData['itineraries'][0]['segments']);
        $arrivalData = end($arrivalData['legs']);
        $pickupDateTime = new \DateTime($arrivalData['arrival']);
        $pickupDateTime->add(new \DateInterval('PT1H'));
        $this->userData['searchParameters']['depDateCar'] = $pickupDateTime->format('Y-m-d');
        $this->userData['searchParameters']['carPickup'] = $arrivalData['destination'];
        $this->userData['searchParameters']['carPickupTime'] = $pickupDateTime->format('H:i');

        $departureData = $flightData['itineraries'][1]['segments'][0]['legs'][0];
        $dropoffDateTime = new \DateTime($departureData['departure']);
        $dropoffDateTime->sub(new \DateInterval('PT2H'));
        $this->userData['searchParameters']['retDateCar'] = $dropoffDateTime->format('Y-m-d');
        $this->userData['searchParameters']['carDropoff'] = $departureData['origin'];
        $this->userData['searchParameters']['carDropoffTime'] = $dropoffDateTime->format('H:i');

        unset($this->userData['sessionData']['cars']);
        $this->userData['inCart']['cars'] = false;
    }

    public function getPackageVfTimestamp(){
        $cartData = \Cart::get($this->userData['cartID']);
        return $cartData['vfTimeStamp'];
    }

    public function updatePaxsParameter($sid,$paxs)
    {
        $userData = $this->userData;
        if (empty($userData['error'])) {
            $searchParameters = $userData['searchParameters'];
            $userData['searchParameters']['occupancy'][0] = $paxs;
            $this->userData = $userData;
            Cache::put($sid, $userData, 1800);
            return true;
        } else {
            return false;
        }
    }

    public function checkFlightArrival($sid, $data, $product)
    {
        if (empty($this->userData['error'])){
            $data['sid'] = $sid;
            $productData = \Cart::add($this->userData['cartID'], $data);
            $flightData=\Cart::remove($this->userData['cartID'], $product);
            $itinerary = $productData['itineraries'][0];
            $segment = array_pop($itinerary['segments']);
            $leg = array_pop($segment['legs']);
            $checkin = $this->userData['searchParameters']['depDateHotel'] ?? $this->userData['searchParameters']['depDate'];
            $checkInDate = strtotime($checkin);
            $flightArrivalDate = strtotime(substr($leg['arrival'], 0, 16));

            if (isset($this->userData['inCart']['hotels']) && ($flightArrivalDate - $checkInDate) > 86400) {
                return true;
            }else if (isset($this->userData['products']['flight']) && isset($this->userData['products']['flight']['changedCheckin'])){
                if ($flightArrivalDate < $checkInDate) {
                    $changedCheckin = $this->userData['products']['flight']['changedCheckin'];
                    return true;
                }
            }
            return false;
        }
    }

}
