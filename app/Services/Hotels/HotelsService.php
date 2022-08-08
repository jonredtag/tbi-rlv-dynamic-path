<?php

namespace App\Services\Hotels;

use App\Repositories\Contracts\APIInterface;
use App\Models\HotelBooking;
use App\Models\EmailData;
use App\Models\PricelinePoi;
use App\Models\BookingHistory;
use \Reviews;

class HotelsService
{
    protected $hotelsRepo;
    protected $topAmenities;

    public function __construct(APIInterface $hotelsRepo)
    {
        $this->topAmenities = [
            'Free Internet Available',
            'Swimming Pool',
            'Free Parking',
            'Fitness Center',
            'WiFi',
            'Air Conditioning',
            'Business Center',
            'On-site parking',
            'Free Internet Access',
            'Pets Allowed',
        ];

        $this->mealPlans = [
            "fullboard" => "Full Board",
            "roomonly" => "Room Only",
            "none" => "Room Only",
            "allinclusive" => "All Inclusive",
            "all_inclusive" => "All Inclusive",
            "bedandbreakfast" => "Breakfast"
        ];

        $this->hotelsRepo = $hotelsRepo;
    }

    public function translateSearch($results, &$prices, $isIncremental, $numTravellers, $isStandalone, $hotelID=null)
    {
        $hotels = [];
        $filters = [
            "priceRange" => [
                "min"=> 1000000000000,
                "max" => 0,
            ]
        ];
        $propertyTypeArr=[];
        $mealPlanDataArr=[];

        $checkInDate = new \DateTime($results['extras']['request']['arrDate']);
        $checkOutDate = new \DateTime($results['extras']['request']['depDate']);
        $duration = intVal($checkInDate->diff($checkOutDate)->format('%a'));
        $numRooms = count($results['extras']['request']['rooms']);
        $discountRate = 0;
        if (!empty($prices['coupon'])) {
            $discountRate += $prices['coupon']['value'];
        }
        $hotelIDs = [];
        foreach ($results['rows'] as $hotel) {
            $base = $hotel['rooms']['rateInfo']['avgBaseRate'];
            $taxes = $hotel['rooms']['rateInfo']['taxesFees'];
            $hotelRate = 0;

            $costPerRoom = $base / $numRooms;
            if ($isStandalone) {
                $hotelRate = $costPerRoom / $duration;
                $preDiscount = $base / $numRooms;
            } else {
                $hotelRate = ($base + $taxes)  / $numTravellers;
                $preDiscount = ($base + $taxes)  / $numTravellers;
            }
            $amenities = [];
            foreach ($this->topAmenities as $t) {
                if(count($amenities) >= 6) {
                    break;
                }
                foreach($hotel['propertyAmenities'] as $amenity) {
                    if (stripos($amenity, $t) !== false) {
                        $amenities[] = $t;
                        continue 2;
                    }
                }
            }
            $topics = [];
            if(isset($hotel['extras']['divinia'])){
                foreach ($hotel['extras']['divinia']['topicReviews'] as $topicReviews){
                    if($topicReviews['topic']['type'] == 'TOPIC'){
                        $topic = [
                            "name" => $topicReviews['topic']['name'],
                            "id" => $topicReviews['topic']['id'],
                            "refId" => $hotel['extras']['divinia']['id'],
                            "sentiment" => $topicReviews['topic']['sentiment'],
                            "reviews" => [],
                        ];

                        if(!empty($topicReviews['items'])){
                            foreach ($topicReviews['items'] as $item) {
                                $topic['reviews'][] = $item['body'];
                            }
                        }
                        array_push($topics, $topic);
                    }
                }
            }


            $mealPlan = $hotel['rooms']['rateInfo']['mealPlan'] ?? '';
            $details = [
                "id" => $hotel['hotelId'],
                "pricelineID" => $hotel['pricelineId'],
                "rowId" => $hotel['positionIndex'],
                "image" => isset($hotel['hotelImages'][0]['url']) ? str_replace('http:', 'https:', $hotel['hotelImages'][0]['url']) : '',
                "name" => $hotel['hotelName'],
                "rating" => $hotel['hotelRating'],
                "rate" => $hotelRate,
                "preDiscount" => $preDiscount,
                "discount" => abs($discountRate),
                "duration" => $duration,
                "baseRate" => $base,
                "nearby" => html_entity_decode($hotel['location']['locationDesc'], ENT_QUOTES | ENT_HTML5),
                "latitude" => $hotel['location']['geoCoordinates']['Lat'],
                "longitude" => $hotel['location']['geoCoordinates']['Lon'],
                "allAmenities" => $hotel['propertyAmenities'],
                "amenities" => $amenities,
                "distanceFrom" => round(floatval($hotel['location']['proximityDistance']), 2),
                "proximityUnit" => $hotel['location']['proximityUnit'],
                "reviewRating" => 0,
                "reviewRatingDescription" => $hotel['reviewRatingDesc'],
                "reviews" => [],
                "amenityBits" => [],
                "products" => '',
                "unicaID" => $hotel['UnicaID'],
                "amenityMask" => $hotel['amenityMask'],
                "mealPlan" => $this->mealPlans[strtolower($mealPlan)] ?? $mealPlan,
                "propertyType" => $hotel['propertyType']??"",
                "vendor" => $hotel['vendor'],
                "topics" => $topics,
            ];
            $hotelIDs[] = $hotel['UnicaID'];

            if($isStandalone) {
                $details["costPerRoom"] = ceil($costPerRoom + ($discountRate / $numRooms));
            }
            if ($details['vendor'] === 'P')  {
                $details['vendor'] = 'PPN';
            } else if ($details['vendor'] === 'TT') {
                $details['vendor'] = 'TTS';
            } else if ($details['vendor'] === 'TN') {
                $details['vendor'] =  substr($hotel['tbiHotelCode'], -3);
            }
            /*****************************************************************/
            /******** This is for testing and will need to be removed ********/
            /******************* or disabled in some manner ******************/
            /*****************************************************************/
            if (config('app.env') !== 'production' && !$isStandalone){
                $breakDown =  [
                    "flight" => $prices['flight']['fare'],
                    "hotel" => $hotelRate,
                ];
                if(isset($prices['transfer'])){
                    $breakDown['transfer'] = $prices['transfer']['fare'];
                }
                $details["breakdown"] = $breakDown;
            }
            /*****************************************************************/
            /*****************************************************************/
            /*****************************************************************/

            // if ($isIncremental) {
            //     $details['rate'] = $details['rate'] - $prices['hotel']['fare'];
            // } else {
                if (!$isStandalone) {
                    foreach ($prices as $key => $value) {
                        if ($key != 'hotel') {
                            $details['rate'] += $value['fare'];
                        }
                    }
                }
            // }

            foreach ($prices as $key => $value) {
                if ($key != 'hotel') {
                    $details['baseRate'] += $value['base'];
                    if ($key !== 'coupon') {
                        $details['preDiscount'] += $value['fare'];
                    }
                }
            }

            if($isStandalone && $discountRate !== 0) {
                $details['rate'] = $details['rate'] + (($discountRate / $duration) / $numRooms);
            }

            $details['preDiscount'] = ceil($details['preDiscount']);

            if (!empty($hotel['amenityMask'])) {
                $unmaskedAmenities = HotelsService::unmaskAmenities($hotel['amenityMask']);
                $details['amenityBits'] = $unmaskedAmenities;
            }

            if ($details['rate'] > $filters['priceRange']['max']) {
                $filters['priceRange']['max'] = $details['rate'];
            }

            if ($details['rate'] < $filters['priceRange']['min']) {
                $filters['priceRange']['min'] = floor($details['rate']);
                if (!$isIncremental) {
                    $prices['hotel'] = [
                        "fare" => $hotelRate,
                        "base" => $base,
                        "taxes" => $taxes,
                    ];
                }
            }

            if(!empty($hotel['propertyType']) && !in_array(strtolower($hotel['propertyType']), $propertyTypeArr)){
                $propertyTypeArr[]=strtolower($hotel['propertyType']);
            }

            if(!in_array($details['mealPlan'], $mealPlanDataArr) ){
                $mealPlanDataArr[] = $details['mealPlan'];
            }

            if (!empty($hotel['rooms']['promo'])) {
                $details['promotion'] = $hotel['rooms']['promo']['description'];
            }

            if (empty($details['promotion']) && $hotel['rooms']['roomsLeft'] > 0 && $hotel['rooms']['roomsLeft'] < 10) {
                $details["promotion"] = $hotel['rooms']['roomsLeft'] . ' rooms available';
            }

            if (count($prices) > 1) {
                $details['products'] = 'hotel, ';
                $details['products'] .= (array_key_exists('flight', $prices) ? 'flight, ' : '');
                $details['products'] .= (array_key_exists('transfer', $prices) ? 'transfer, ' : '');
            }

            if($hotelID !== null && $hotelID == $details['unicaID']) {
                array_unshift($hotels, $details);
            } else {
                $hotels[] = $details;
            }
        }

        $reviews = Reviews::getReviewsByHotels($hotelIDs);

        $geoCoordinates=explode("|",$results['extras']['request']['locationKey']);
        $latitude=$geoCoordinates[0]; $longitude=$geoCoordinates[1];
        $pois = PricelinePoi::getByLatLong($latitude, $longitude, 10)->get();
        $filters['POIS'] = [];
        foreach($pois as $poi) {
            $filters['POIS'][] = [
                'text' => $poi['name'],
                'value' => $poi['latitude'] . '|' . $poi['longitude'],
            ];
        }

        $filters['property_type']=[];
        if(isset($propertyTypeArr) && count($propertyTypeArr)) {
            foreach ($propertyTypeArr as $key => $val) {
                $filters['property_type'][] = [
                    'text' => ucwords($val),
                    'value' => strtolower($val),
                ];
            }
        }

        $filters['meal_plan']=[];
        if(isset($mealPlanDataArr) && count($mealPlanDataArr)) {
            foreach ($mealPlanDataArr as $key => $val) {
                $filters['meal_plan'][] = [
                    'text' => ucwords($val),
                    'value' => strtolower($val),
                ];
            }
        }

        foreach ($hotels as &$hotel) {
            $hotel['reviews'] = $reviews[$hotel['unicaID']] ?? null;
        }

        return ["hotels" => $hotels, "filters" => $filters];
    }

    public function filter($results, $params = [])
    {
        $hotels = [];
        if (is_null($results) || !count($results)) {
            return $hotels;
        }

        foreach ($results as $index => $hotel) {
            $valid = true;
            
            if (!empty($params['stars'])) {
                if (!in_array(\strval($hotel['rating']), $params['stars'])) {
                    $valid = false;
                }
                if(strpos($hotel['rating'], '.5') !== false) {
                    // dd($hotel);
                    $ratingRound = (float) str_replace(".5",".0",$hotel['rating']);
                    // dd($ratingRound);
                    if (!in_array(\strval($ratingRound), $params['stars'])) {
                        $valid = false;
                    } else {
                        $valid = true;
                    }
                }
            }
            

            if (!empty($params['review']) && (empty($hotel['reviews']) || !in_array($hotel['reviews']['scoreDescription'], $params['review']))) {
                $valid = false;
            }

            if (!empty($params['feature'])) {
                $amValid = 0;
                foreach ($params['feature'] as $am) {
                    foreach ($hotel['allAmenities'] as $amenity) {
                        if (strtolower($am) == strtolower($amenity) || stripos($amenity, $am) !== false) {
                            $amValid++;
                            continue 2;
                        }
                    }
                }
                // all passed features must have matched one amenity
                $valid = $valid && $amValid >= count($params['feature']);
            }

            if (!empty($params['name'])) {
                if (!preg_match("/".preg_quote($params['name'])."/i", $hotel['name'])) {
                    $valid = false;
                }
            }

            if (!empty($params['poi'])){                
                $poiVal = explode('|', $params['poi'][0]);
                $poiLat = $poiVal[0];
                $poiLong = $poiVal[1];
                $distance = $this->getDistance($poiLat, $poiLong, $hotel['latitude'], $hotel['longitude']);
                if (floatval($distance) > 5) {
                    $valid = false;
                }
            }

            if(!empty($params['property_type']) && (count($params['property_type']) > 0)){
                if(isset($hotel['propertyType']) && !empty($hotel['propertyType'])){
                    if (!in_array(strtolower($hotel['propertyType']),$params['property_type'])){
                        $valid = false;
                    }
                }else{
                    // $valid = false; /* When propertyType is empty */
                }
            }

            if (!empty($params['meal_plan']) && (count($params['meal_plan'])>0) ) {
                if(!empty($hotel['mealPlan'])){
                    if (!in_array(strtolower($hotel['mealPlan']),$params['meal_plan'])){
                        $valid = false;
                    }
                }else{
                    // $valid = false; /* When mealPlan is empty */
                }
            }

            if (!empty($params['price'])) {
                if ($hotel['rate'] < $params['price'][0] || $hotel['rate'] > $params['price'][1]) {
                    $valid = false;
                }
            }

            if ($valid) {
                $hotels[] = $index;
            }
        }

        if (!empty($params['sort'])) {
            usort($hotels, function($aIndex, $bIndex) use ($params, $results) {
                $response = 0;
                $a = $results[$aIndex];
                $b = $results[$bIndex];
                if ($params['sort'] === 'di') {
                    if ($a['distanceFrom'] < $b['distanceFrom']) {
                        $response = -1;
                    } elseif ($a['distanceFrom'] > $b['distanceFrom']) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 'p_lh') {
                    if ($a['rate'] < $b['rate']) {
                        $response = -1;
                    } elseif ($a['rate'] > $b['rate']) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 'p_hl') {
                    if ($a['rate'] < $b['rate']) {
                        $response = 1;
                    } elseif ($a['rate'] > $b['rate']) {
                        $response = -1;
                    }
                } elseif ($params['sort'] === 's_lh') {
                    if ($a['rating'] < $b['rating']) {
                        $response = -1;
                    } elseif ($a['rating'] > $b['rating']) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 's_hl') {
                    if ($a['rating'] < $b['rating']) {
                        $response = 1;
                    } elseif ($a['rating'] > $b['rating']) {
                        $response = -1;
                    }
                } elseif ($params['sort'] === 'n_az') {
                    if (strtolower($a['name']) < strtolower($b['name'])) {
                        $response = -1;
                    } elseif (strtolower($a['name']) > strtolower($b['name'])) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 'n_za') {
                    if (strtolower($a['name']) < strtolower($b['name'])) {
                        $response = 1;
                    } elseif (strtolower($a['name']) > strtolower($b['name'])) {
                        $response = -1;
                    }
                }
                return $response;
            });
        }
        return $hotels;
    }

    public function getDistance($poiLat, $poiLong, $hotelLat, $hotelLong) 
    {
        return 3959 * acos(
            cos(
                deg2rad($poiLat)
            ) * cos(
                deg2rad($hotelLat)
            ) * cos(
                deg2rad($hotelLong) - deg2rad($poiLong)
            ) + sin(
                deg2rad($poiLat)
            ) * sin(
                deg2rad($hotelLat)
            )
        );
    }

    public function translateDetails($details, &$prices, $numTravellers, $params, $isStandalone)
    {
        if (empty($details['hotelDetails']['hotelId'])) {
            return [];
        }

        $checkInDate = \Carbon\Carbon::parse($params['depDateHotel'] ?? $params['depDate'])->tz('UTC')->hour(0);
        $checkOutDate = \Carbon\Carbon::parse($params['retDateHotel'] ?? $params['retDate'])->tz('UTC')->hour(0);
        $numRooms = count($params['occupancy']);

        $duration = intVal($checkInDate->diff($checkOutDate)->format('%a'));
        $value_adds_map = array(
            "1"             =>  'icon-all-meals',  // "All Meals"
            "2"             =>  'icon-cup',  // "Continental Breakfast"
            "4"             =>  'icon-cup',  // "Full Breakfast"
            "8"             =>  'icon-cup',  // "English Breakfast"
            "16"            =>  'icon-free-lunch',  // "Free Lunch"
            "32"            =>  'icon-free-dinner',  // "Free Dinner"
            "64"            =>  '',  // "Food/Beverage Credit"
            "128"           =>  'icon-car',  // "Free Parking"
            "256"           =>  'icon-free-airport-parking',  // "Free Airport Parking"
            "512"           =>  'icon-all-inclusive',  // "All-Inclusive"
            "1024"          =>  'icon-wifi',  // "Free High-Speed Internet"
            "2048"          =>  'icon-wifi',  // "Free Wireless Internet"
            "4096"          =>  'icon-cup',  // "Continental Breakfast for 2"
            "8192"          =>  'icon-cup',  // "Breakfast for 2"
            "16384"         =>  'icon-car',  // "Free Valet Parking"
            "32768"         =>  'icon-airport-transfers',  // "Free Airport Shuttle"
            "65536"         =>  'icon-free-room-upgrade',  // "Free Room Upgrade"
            "524288"        =>  'icon-spa',  // "Spa Credit"
            "1048576"       =>  'icon-golf-credit',  // "Golf Credit"
            "2097152"       =>  'icon-vip-line-access',  // "VIP Line Access to Nightclub(s)"
            "4194304"       =>  'icon-2-for-1-buffet',  // "2-for-1 Buffet"
            "16777216"      =>  'icon-cup',  // "Breakfast Buffet"
            "134217728"     =>  'icon-kitchen',  // "Full Kitchen"
            "536870912"     =>  'icon-casino-credit',  // "Casino Credit"
        );

        $valueAddGroups = [
            [1024, 2048],
            [128, 16384],
            [2, 4, 8, 4096, 8192, 16777216],
            [32768],
            [134217728],
            [64],
            [524288],
            [1048576],
            [512],
            [1],
            [16],
            [32],
            [4194304],
            [65536],
            [536870912],
            [2097152],
            [256],
        ];

        $valueAddsOrder = [ 1024, 2048, 128, 16384, 2, 4, 8, 4096, 8192, 16777216, 32768, 134217728, 64, 524288, 1048576, 512, 1, 16, 32, 4194304, 65536, 536870912, 2097152, 256 ];
        $amenities = [];
        if (isset($details['hotelDetails']['propertyAmenities']) && !empty($details['hotelDetails']['propertyAmenities'])) {
            foreach ($this->topAmenities as $t) {
                if (in_array($t, $details['hotelDetails']['propertyAmenities']) && count($amenities) < 4) {
                    $amenities[] = $t;
                }
            }
        }

        $hotelData = [
            "name" => $details['hotelDetails']['hotelName'],
            "rating" => $details['hotelDetails']['hotelRating'],
            "address" => $details['hotelDetails']['location']['address']['ad1'].', '.(!empty($details['hotelDetails']['location']['address']['postalCode']) ? $details['hotelDetails']['location']['address']['postalCode']. ' ' : ''). $details['hotelDetails']['location']['address']['city'] .', '. $details['hotelDetails']['location']['address']['countryCode'],
            "city" => $details['hotelDetails']['location']['address']['city'],
            "countryCode" => $details['hotelDetails']['location']['address']['countryCode'],
            "postalCode" => (!empty($details['hotelDetails']['location']['address']['postalCode']) ? $details['hotelDetails']['location']['address']['postalCode']. ' ' : ''),
            "allAmenities" => $details['hotelDetails']['propertyAmenities'] ?? [],
            "amenities" => $amenities,
            "latitude" => $details['hotelDetails']['location']['geoCoordinates']['Lat'],
            "longitude" => $details['hotelDetails']['location']['geoCoordinates']['Lon'],
            "gallery" => [],
            "roomResults" => [],
            "reviews" => Reviews::getHotelReview($details['hotelDetails']['UnicaID']),
            //"propertyDescription" => $details['hotelDetails']['propertyDescription'],
            "propertyDescription" => $this->metricToMile($details['hotelDetails']['propertyDescription']),
            "tripAdvisorIcon" => $details['hotelDetails']['reviews']['tripAdvisorRatingUrl']??"",
            "tripAdvisorCount" => $details['hotelDetails']['reviews']['tripAdvisorReviewCount']??"",
            "landmarks" => [],
            "policies" => [],
        ];
        $reviews = Reviews::getReviewsByHotels([$details['hotelDetails']['UnicaID']]);

        // dd($reviews);
        if(!empty($reviews)) {
            $hotelData['review'] = $reviews[$details['hotelDetails']['UnicaID']];
        }

        if(isset($details['hotelDetails']['hotelImages'])) {
            foreach ($details['hotelDetails']['hotelImages'] as $image) {
                $imageurl = str_replace('http:', 'https:', $image['url']);
                $hotelData['gallery'][] = [
                    "image" => $imageurl,
                    "thumbnail" => substr($imageurl, 0, -5) . 'n.jpg',
                ];
            }
        }

        $POIs = PricelinePoi::getByLatLong($hotelData['latitude'], $hotelData['longitude'], 10)->get();

        if (!is_null($POIs)) {
            foreach ($POIs as $poi) {
                $hotelData['landmarks'][] = [
                    'name' => $poi->name,
                    'distance' => $poi->distance,
                ];
            }
        }
        
        if (!empty($details['hotelDetails']["roomFeesDescription"])) {
            $hotelData["propertyDescription"] = $hotelData["propertyDescription"]."<br/><br/>".$details['hotelDetails']["roomFeesDescription"]; 
        }

        if (!empty($details['hotelDetails']["checkInTime"]) && !empty($details['hotelDetails']["checkOutTime"])) {
            $hotelData['policies'][] = [
                'title' => 'Check In/Out times',
                'content' => 'Check-in: '.$details['hotelDetails']["checkInTime"] .'<br />'. 'Check-out: '.$details['hotelDetails']["checkOutTime"],
            ];
        }

        

        if(!empty($details['hotelDetails']["specialCheckInInstructions"])) {
            $hotelData['policies'][] = [
                'title' => 'Special Check-in Instructions',
                'content' => $details['hotelDetails']["specialCheckInInstructions"],
            ];
        }

        


        if (!empty($details['hotelDetails']["checkInInstructions"])) {
            $hotelData['policies'][] = [
                'title' => 'Check-in Instructions',
                'content' => $details['hotelDetails']["checkInInstructions"][0],
            ];
        }

        if(!empty($details['hotelDetails']["knowBeforeYouGoDescription"])) {
            $hotelData['policies'][] = [
                'title' => 'You need to know',
                'content' => $details['hotelDetails']["knowBeforeYouGoDescription"],
            ];
        }

        if (!empty($details['hotelDetails']["roomFeesDescription"])) {
            $hotelData['policies'][] = [
                'title' => 'Fees',
                'content' => $details['hotelDetails']["roomFeesDescription"],
            ];
        }


        
        //dd($details['roomResults']);
        if (count($details['roomResults']['rows']) > 0) {
            $prices['hotel'] = [
                "fare" => $details['roomResults']['rows'][0]['rateinfo']['pricingInfo']['total'] / $numTravellers,
                "base" => $details['roomResults']['rows'][0]['rateinfo']['pricingInfo']['totalBase'],
                "taxes" => $details['roomResults']['rows'][0]['rateinfo']['pricingInfo']['totalTaxes'],
            ];


            $baseFare = 0;
            foreach ($prices as $key => $value) {
                $baseFare += $value['fare'];
            }

            $baseFare = max($baseFare, 0);

            $discountRate = 0;
            if (!empty($prices['coupon'])) {
                $discountRate += $prices['coupon']['value'];
            }

            $roomOptions = $details['roomResults'];
            $roomElements = [];
            foreach ($roomOptions['rows'] as $roomIndex => $room) {
                $rate = 0;
                $costPerRoom = ($room['rateinfo']['pricingInfo']['totalBase'] + $discountRate) / $numRooms;
                if(!$isStandalone){
                    $rate = intval($room['rateinfo']['pricingInfo']['total'] / $numTravellers);
                } else {
                    $rate = $costPerRoom / $duration;
                }
                $mandatoryFeeTotal = 0;
                if (!empty($room['rateinfo']['pricingInfo']['mandatoryFeeDetails']['breakdown']['postpaid']['breakdown'])) {
                    $postpaidBreakdown = $room['rateinfo']['pricingInfo']['mandatoryFeeDetails']['breakdown']['postpaid']['breakdown'];
                    foreach (array_keys($postpaidBreakdown) as $feeKey) {

                        $fee = $postpaidBreakdown[$feeKey];
                        if ($fee['type'] != 'Resort Fee') {
                            continue;
                        }
                        $mandatoryFeeTotal = $fee['display_total'] / $duration;
                        break;
                    }
                }

                $cancellations = $room['rateinfo']['pricingInfo']['cancellationPolicy'];
                $isFree = false;
                $cancellationPolicies = [];
                foreach ($cancellations as $entries) {
                    foreach($entries as $key => $policy) {
                        $now = \Carbon\Carbon::now()->tz('UTC')->hour(0);
                        $after = \Carbon\Carbon::parse($policy['date_after'])->tz('UTC')->hour(0);
                        if($after->lessThan($now)) {
                            $after = $now;
                        }
                        $before = \Carbon\Carbon::parse($policy['date_before'])->tz('UTC')->hour(0);

                        $penalty = '$' . $policy['display_total_charges'] . ' ' . $policy['display_currency'];
                        if($policy['display_total_charges'] == 0 || $policy['display_total_charges'] == 25) {
                            $policy['description'] = "Free cancellation up until ".$before->format('M d, Y').".";
                            $isFree = $before->format('M d, Y');
                        }
                        // else if($before->greaterThan($checkInDate)) {
                        //     $policy['description'] = "Cancelling as of ".$checkInDate->format('M d, Y')." will incur a pentalty of $penalty";
                        // }
                        else {
                            if (\App::getLocale() == 'en') {
                                $penalty = '$' . $policy['display_total_charges'] . ' ' . $policy['display_currency'];
                                $policy['description'] = "Cancelling between ".$after->format('M d, Y')." and ".$before->format('M d, Y')." incurs a penalty of $penalty.";
                            } else {
                                $penalty = number_format($policy['display_total_charges'], 2, ',', ' ') . ' ' . $policy['display_currency'];
                                $policy['description'] = "L’annulation entre ".$after->format('M d, Y')." et ".$before->format('M d, Y')." encourt des frais de pénalités de $penalty.";
                            }
                        }

                        if($isFree === false) {
                            array_unshift($cancellationPolicies, $policy);
                        } else {
                            array_push($cancellationPolicies, $policy);
                        }
                    }
                }
                
                $mealPlan = $room['rateinfo']['attr']['mealPlan'] ?? '';
                $detail = [
                    "roomIndex" => $roomIndex,
                    "name" =>  is_string($room['rateinfo']['attr']['roomDescription']) ? $room['rateinfo']['attr']['roomDescription'] : 'Unknown',
                    "occupancy" => $room['room']['occupancy'],
                    "rate" => $rate,
                    "preDiscountBase" => $room['rateinfo']['pricingInfo']['totalBase'],
                    "discount" => abs($discountRate),
                    "duration" => $duration,
                    "costPerRoom" => $costPerRoom,
                    "baseRate" => $room['rateinfo']['pricingInfo']['totalBase'],
                    "rateTotal" => $room['rateinfo']['pricingInfo']['total'],
                    "rateTotalPerPerson" => $room['rateinfo']['pricingInfo']['total'] / $numTravellers,
                    "cancellation" => $room['rateinfo']['pricingInfo']['refundable'],
                    "cancellationPolicy" => $cancellationPolicies,
                    "freeCancellation" => $isFree,
                    "amenities" => $room['room']['amenities'],
                    "mandatoryFeeDetails" => $room['rateinfo']['pricingInfo']['mandatoryFeeDetails'] ?? [],
                    "mandatoryFeeTotal" => $mandatoryFeeTotal,
                    "policyData" => $room['rateinfo']['pricingInfo']['policyData'],
                    "roomsAvailable" => $room['rateinfo']['attr']['roomsLeft'],
                    "roomDescription" => $room['rateinfo']['attr']['roomDescriptionTxt'],
                    "mealPlan" => $this->mealPlans[strtolower($mealPlan)] ?? $mealPlan,
                    "image" => isset($room['room']['images'][0]) ? $room['room']['images'][0] : null,
                    "bedTypes" => [],
                    "images" => [],
                    "roomSquareFootage" => isset($room['room']['roomSquareFootage']) ? $room['room']['roomSquareFootage'] : "",
                    "UnicaID"=>$details['hotelDetails']['UnicaID'],
                ];

                foreach ($prices as $key => $value) {
                    if ($key !== 'hotel') {
                        $detail['baseRate'] += $value['base'];
                        $detail['rateTotalPerPerson'] += $value['fare'];
                    }
                }

                if (!$isStandalone) {
                    $detail['rate'] = max(($detail['rateTotalPerPerson'] - $baseFare), 0);
                }

                if (!empty($details['hotelDetails']["checkInInstructions"]) || !empty($details['hotelDetails']['specialCheckInInstructions'])) {
                    $detail['checkInInstructions'] = !empty($details['hotelDetails']["checkInInstructions"]) ? $details['hotelDetails']["checkInInstructions"] : '';
                    // $detail['checkInInstructions'] .= !empty($details['hotelDetails']["specialCheckInInstructions"]) ? $details['hotelDetails']["specialCheckInInstructions"] : '';
                }
                if (is_array($room['room']['bedTypes']) && count($room['room']['bedTypes'])) {
                    foreach ($room['room']['bedTypes'] as $bedType) {
                        if (is_array($details['extras']['bedTypes']) && array_key_exists($bedType, $details['extras']['bedTypes'])) {
                            $detail['bedTypes'][] = $details['extras']['bedTypes'][$bedType];
                        }
                    }
                }
                if(isset($detail['bedTypes']) && empty($detail['bedTypes'])){
                    $detail['bedTypes'] = $room['room']['bedTypes'];
                }

                if(isset($detail['images']) && empty($detail['images'])){
                    $detail['images'] =  $room['room']['images'];
                }

                foreach ($room['room']['smokingPreferences'] as $smokingPreference) {
                    $detail['smokingPreferences'][$smokingPreference] = $details['extras']['smokingPreferences'][$smokingPreference];
                }

                $icons = [];
                if (is_array($room['room']['valueAdds']) && count($room['room']['valueAdds'])) {
                    foreach ($room['room']['valueAdds'] as $valueAdd) {
                        if (array_key_exists($valueAdd['id'], $value_adds_map)) {
                            $icons[] = $value_adds_map[$valueAdd['id']];
                        }
                    }
                }

                $detail['valueAdds'] = array_unique($icons);
                $roomElements[$detail['name']][] = $detail;
            }

            foreach ($roomElements as $name => $rooms) {
                list($image,$rooms) = $this->filterRoomsData($rooms,[ 'selectedProducts' => $params['selectedProducts']]);
                $hotelData['roomResults'][] = ["name" => $name, "image" => $image, "rooms" => $rooms];
            }
        } else {
            $prices['hotel'] = 0;
        }
        return $hotelData;
    }

    public function filterRoomsData($rooms,$params=[]){
        $_data = array(); 
        $image = "";
        foreach ($rooms as $roomkey => $room){
            if ($image === '' && $room['image'] !== null) {
                $image = $room['image'][0]['url']??'';
            }

            // S check freeCancellation
            $_freeCancellation='';
            if($params['selectedProducts'] != 'FH'){
                if ($room['freeCancellation'] !== false) {
                    $_freeCancellation=date('MdY',strtotime($room['freeCancellation']));
                }
            }
            // E check freeCancellation

            // S formate mealPlan
            $_mealPlan='';
            if(isset($room['mealPlan']) && !empty($room['mealPlan'])){
                $_mealPlan=strtolower(str_replace(' ', '',$room['mealPlan']));
            }
            // E Formate mealPlan

            if($params['selectedProducts'] == 'FH'){
                $_dataKey=$room['occupancy'].$_mealPlan;
            }else{
                $_dataKey=$room['occupancy'].$_freeCancellation.$_mealPlan;
            }
            if (isset($_data[
                $_dataKey
            ])) {
                // S check rate
                // if( $room['rate'] > $_data[$_dataKey]['rate'] ){ /* if want higer rate */
                if( $room['rate'] < $_data[$_dataKey]['rate'] ){ /* Lower rate */
                    $_data[$_dataKey]=$room;
                }
                // E check rate

                continue; // found duplicate
            }
            // remember unique item
            $_data[$_dataKey]=$room;
        }
        $rooms = array_values($_data);
        return [$image,$rooms];
    }

    public function autocomplete($term='')
    {
        if ($term !== '') {
            $details = $this->hotelsRepo->autocomplete($term);

            $autocompleteElements = ["cities" => [] , "airports" => [], "POIs" => []];

            foreach ($details as $type) {
                foreach ($type as $detail) {
                    if ( empty($detail['Latitude']) || empty($detail['Longitude'])) continue;
                    
                    $autocompleteElement = [
                        "text" => $detail['English'],
                        "value" => "2:$detail[Latitude]|$detail[Longitude]",
                        "category" => $detail['DisplayType'],
                        "id" => "$detail[id]",
                        "point" => [
                            "latitude" => $detail['Latitude'],
                            "longitude" => $detail['Longitude']
                        ]
                    ];

                    if ($detail['DisplayType'] === 'Cities and Neighbourhoods') {
                        $autocompleteElements['cities'][] = $autocompleteElement;
                    } elseif ($detail['DisplayType'] === 'Airports') {
                        $autocompleteElements['airports'][] = $autocompleteElement;
                    } elseif ($detail['DisplayType'] === 'Points of Interest') {
                        $autocompleteElements['POIs'][] = $autocompleteElement;
                    }
                }
            }

            return array_merge(array_splice($autocompleteElements['cities'], 0, 5), array_splice($autocompleteElements['POIs'], 0, 4), array_splice($autocompleteElements['airports'], 0, 2));
        }
        return [];
    }

    public static function unmaskAmenities($mask)
    {
        if (is_int($mask)) {

            $scan = 1;
            $amenities = array();
            while ($mask >= $scan) {
                if ($mask & $scan)
                    $amenities[] = $scan;
                    $scan<<=1; //bit shift
            }

            return $amenities;

        } else {
            return false;
        }
    }

    public function book($params, $bookingID)
    {
        list($request, $data) = $this->hotelsRepo->book($params);

        $history = new BookingHistory;

        $history->action = 'hotel';
        $history->booking_id = $bookingID;
        $history->request = $request;
        $history->response = json_encode($data);

        $history->save();

        return $data;
    }

    public function getBookingResponse($data)
    {
        $hotel = $data['verifyResult']['products']['hotel'];
        $rateinfo = $hotel['roomResults']['rows'][0]['rateInfo'][0];

        $vendorID = '';
        if(!empty($hotel['hotelDetails']['vendorId'])) {
            $idParts = explode('-', $hotel['hotelDetails']['vendorId']);
            $vendorID = array_pop($idParts);
        }
        $hotelData = [
            "bookingNumber" => (isset($data['bookingResult']) ? $data['bookingResult']['bookingInfo']['confirmationNumber'] : 'PENDING'),
            "status" => (isset($data['bookingResult']) ? strtolower($data['bookingResult']['bookingInfo']['status'] ?? 'OK') : 'pending'),
            "name" => $hotel['hotelDetails']['hotelName'],
            "id" => $hotel['hotelDetails']['hotelId'],
            "vendorHotelID" => $vendorID,
            "address" => ($hotel['hotelDetails']['location']['address']['ad1'].', '.$hotel['hotelDetails']['location']['address']['city']),
            "city" => $hotel['hotelDetails']['location']['address']['city'],
            "countryCode" => $hotel['hotelDetails']['location']['address']['countryCode'],
            "postalCode" => $hotel['hotelDetails']['location']['address']['postalCode'],
            "roomType" => $hotel['roomResults']['rows'][0]['rateInfo'][0]['attr']['roomDescription'],
            // "bedType" => (!empty($hotel['roomResults']['rows'][0]['room']['bedTypes']) ? $hotel['roomResults']['rows'][0]['room']['bedTypes']['quantity'] . ' '. $hotel['roomResults']['rows'][0]['room']['bedTypes']['type'] : ''),
            "bedType" => (!empty($hotel['roomResults']['rows'][0]['room']['bedTypes']) ? $hotel['roomResults']['rows'][0]['room']['bedTypes'][0] : ''),
            "rating" => $hotel['hotelDetails']['hotelRating'],
            "numOfRooms" => count($data['searchParameters']['occupancy']),
            "image" => (!empty($hotel['hotelDetails']['hotelImages']) ? $hotel['hotelDetails']['hotelImages'][0]['url'] : ''),
            // "adults" => 0, // $hotel['roomResults']['noOfAdults'],
            // "children" => 0, // $hotel['roomResults']['noOfChildren'],
            "confirmationDate" => (isset($data['bookingResult']) ? $data['bookingResult']['bookingInfo']['bookingDate'] : 'PENDING'),
            "checkIn" => $hotel['roomResults']['checkInDate'],
            "checkOut" => $hotel['roomResults']['checkOutDate'],
            // "nights" => $hotel['roomResults']['noOfNights'],
            // "traveller" => $traveller['first'] . ' ' . $traveller['last']
            'mandatory' => [],
            'cancellationPolicy' => [],
            'checkInInstructions' => [],
            'virtualCard' => (isset($data['bookingResult']['bookingInfo']['virtualCard']) ? $data['bookingResult']['bookingInfo']['virtualCard'] : null),
        ];

        if (!empty($hotel['hotelDetails']["checkInInstructions"]) || !empty($hotel['hotelDetails']['specialCheckInInstructions'])) {
            $hotelData['checkInInstructions'][0]['paragraph_0'] = !empty($hotel['hotelDetails']["checkInInstructions"]) ? $hotel['hotelDetails']["checkInInstructions"] : '';
            $hotelData['checkInInstructions'][0]['paragraph_0'] .= !empty($hotel['hotelDetails']["specialCheckInInstructions"]) ? $hotel['hotelDetails']["specialCheckInInstructions"] : '';
        }


        $vendor = isset($hotel['vendor']) ? 'PPN' : '';
        if ($vendor === '') {
            if (preg_match("/_[A-Z]{3}$/", $hotel['hotelDetails']['vendorId'])) {
                $vendor = substr($hotel['hotelDetails']['vendorId'], -3);
            } else {
                $vendor = 'TTS';
            }
        }
        $hotelData['vendor'] = $vendor;
        if(!empty($data['roomResult']['rateinfo']['pricingInfo']['policyData'])) {
            foreach ($data['roomResult']['rateinfo']['pricingInfo']['policyData'][0] as $policy) {
                if(stripos($policy['title'], 'mandatory') !== false) {
                    $hotelData['mandatory'][] = $policy['paragraph_data'];
                }
                // if(stripos($policy['title'], 'cancellation') !== false) {
                //     $hotelData['cancellationPolicy'][] = $policy['paragraph_data'];
                // }
            }
        }

        $cancellations = !empty($rateinfo['pricingInfo'][0]['cancellationPolicy']) ? $rateinfo['pricingInfo'][0]['cancellationPolicy'] : [];
        if(count($cancellations)){
            $cancellationPolicy = "";

            $checkInDate = \Carbon\Carbon::parse($data['searchParameters']['depDate'])->tz('UTC');
            $isFree = false;
            $cancellationPolicies = [];
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
                    // } else if($before->greaterThan($checkInDate)) {
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

            $hotelData['cancellationPolicy'][] = ["paragraph_0"=> substr($cancellationPolicy, 0, -12)];
        }


        // foreach ($data['roomData'] as $index => $room) {
        //     $hotelData['adults'] += $room['adults'];
        //     $hotelData['children'] += $room['children'];
        // }

        // if (!empty($data['verifyResult']['products']['hotel']['hotelDetails']["checkInInstructions"]) || !empty($data['verifyResult']['products']['hotel']['hotelDetails']['specialCheckInInstructions'])) {
        //     $hotelData['checkInInstructions'] = !empty($data['verifyResult']['products']['hotel']['hotelDetails']["checkInInstructions"]) ? $data['verifyResult']['products']['hotel']['hotelDetails']["checkInInstructions"] : '';
        //     $hotelData['checkInInstructions'] .= !empty($data['verifyResult']['products']['hotel']['hotelDetails']["specialCheckInInstructions"]) ? $data['verifyResult']['products']['hotel']['hotelDetails']["specialCheckInInstructions"] : '';
        // }

        $rateinfo = $data['verifyResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0];
        if (!empty($rateinfo['pricingInfo'][0]['hotelFees'])) {
            $total = $rateinfo['pricingInfo'][0]['hotelFees'];
            // foreach ($rateinfo['pricingInfo'][0]['hotelFees'] as $fee) {
            //     $total += $fee['amount'];
            // }
            $hotelData['extraFees'] = $total;
        }

        $hotelData["subTotal"] = $rateinfo['pricingInfo'][0]['totalBase'];
        $hotelData["total"] = $rateinfo['pricingInfo'][0]['total'];
        $hotelData["taxes"] = $rateinfo['pricingInfo'][0]['totalTaxes'];
        $hotelData['markupCommission'] = isset($rateinfo['pricingInfo'][0]['markupCommission']) ? $rateinfo['pricingInfo'][0]['markupCommission'] : 0;

        foreach ($rateinfo['pricingInfo'][0]['surcharges'] as $surcharge) {
            if ($surcharge['type'] === 'SalesTax') {
                $hotelData['salesTax'] = $surcharge['amount'];
                break;
            }
        }

        // foreach ($data['roomData'] as $index => $room) {
        //     $data['roomData'][$index]['bedType'] = $data['verifyResult']['products']['hotel']['roomResults']['extras']['bedTypes'][$data['beds'][$index]];
        // }
        // $hotelData['rooms'] = $data['roomData'];

        // if (!empty($data['verifyResult']['roomInfo']['rooms'][0]['smokingPreference'])) {
        //     $hotelData["smokingPreference"] = $data['verifyResult']['roomInfo']['rooms'][0]['smokingPreference'];
        // }
        //
        return $hotelData;
    }

    public function logBooking($data, $bookingID)
    {

        $hotelData = $this->getBookingResponse($data);

        $hotelBooking = new HotelBooking;

        $hotelBooking->hotel_booking_number = $hotelData['bookingNumber'];
        $hotelBooking->booking_id = $bookingID;
        $hotelBooking->booking_data = json_encode($hotelData);
        $hotelBooking->booking_status = isset($data['bookingResult']) ? 3 : 1;
        $hotelBooking->active = 1;

        $hotelBooking->save();

        return $hotelData;
    }

    public function updateBookingRecord($data, $bookingID)
    {
        $hotelBooking = HotelBooking::where('booking_id', $bookingID)->first();

        $hotelData = json_decode($hotelBooking->booking_data, true);
        $hotelData['bookingNumber'] = $data['confirmationNumber'];
        $hotelData['status'] = strtolower($data['status'] ?? 'OK');
        $hotelData['confirmationDate'] = $data['bookingDate'];
        $hotelData['virtualCard'] = isset($data['virtualCard'])?$data['virtualCard']:null;

        $hotelBooking->hotel_booking_number = $hotelData['bookingNumber'];
        $hotelBooking->booking_data = json_encode($hotelData);
        $hotelBooking->booking_status = 3;
        $hotelBooking->active = 1;

        $hotelBooking->save();

        return $hotelData;
    }

    public function updateBooking($bookingID, $data)
    {
        $bookingRecord = HotelBooking::where('booking_id', $bookingID)->first();

        $currentData = json_decode($bookingRecord->booking_data, true);

        $bookingRecord->hotel_booking_number = $data['bookingInfo']['confirmationNumber'];
        $currentData['bookingNumber'] = $data['bookingInfo']['confirmationNumber'];
        $currentData['confirmationDate'] = $data['bookingInfo']['bookingDate'];
        $bookingRecord->booking_status = 3;

        $bookingRecord->booking_data = json_encode($currentData);
        $bookingRecord->save();

        return $currentData;
    }

    public function metricToMile($description) 
    {
        $result = preg_replace_callback(
            '/ ([0-9]*\.[0-9]+|[0-9]+) m /i',
            function ($matches) {
                return ' ' . strval(round(floatval($matches[1]) * 0.00062, 2)) . ' mile ';
            },
            $description
        );

        return preg_replace_callback(
            '/ ([0-9]*\.[0-9]+|[0-9]+) km /i',
            function ($matches) {
                return ' ' . strval(round(floatval($matches[1]) * 0.62137, 2)) . ' mile ';
            },
            $result
        );
    }
}
