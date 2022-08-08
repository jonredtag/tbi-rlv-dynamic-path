<?php

namespace App\Repositories\Concrete;

use App\Helper\Helpers;
use App\Models\Airports;
use App\Repositories\Contracts\PackageInterface;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Promise;
use GuzzleHttp\TransferStats;
use App\Models\DiviniaLogs;

class PackageRepository implements PackageInterface {

    private $baseHotelApiUrl;
    private $baseFlightApiUrl;
    private $baseFlightRefundableApiUrl;
    private $baseMarkupApiUrl;

    public function __construct()
    {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
                'verify' => false
            ]
        );
        $this->ip = Helpers::getClientIp();
        $this->baseHotelApiUrl = config('api.hotel');
        $this->baseFlightApiUrl = config('api.flight');
        $this->baseFlightRefundableApiUrl = config('api.flight-refundable');
        $this->baseMarkupApiUrl = config('api.dashboard-feeds');
    }
//
    public function search($params, $products)
    {
        $transferTimes = ['hotel' => 0, 'flight' => 0, 'start' => microtime()];
        $promises = [];
        $responses = [];
        if (in_array('hotels', $products)) {
            $query = [
                "affiliate" => [
                    "key" => config('site.htl_affiliate')
                ],
                "searchRQ" => [
                    "version" => "v1",
                    "inputs" => [
                        "locationKey" => $params['destination']['latitude']."|".$params['destination']['longitude'],
                        "searchType" => "init",
                        "rooms" => $params['occupancy'],
                        "Polygon" => true,
                        "radius" => 20,
                        "PricelineId" => $params['destination']['cityId'] ?? '',
                        "sortBy" => "1",
                        "cur" => config('app.currency'),
                        "depDate" => $params['depDateHotel'] ?? $params['depDate'],
                        "arrDate" => $params['retDateHotel'] ?? $params['retDate'],
                        "noOfResultsPerPage" => "200",
                        "noCache" => true,
                        "userIP" => $this->ip,
                        "lang" => $params['lang'],
                        "searchApis" => config('services.hotels.providers'),
                        "userAgent" => $_SERVER['HTTP_USER_AGENT']
                    ]
                ]
            ];

            if(isset($params['selectedProducts']) && ($params['selectedProducts'] == 'H') && !config('api.hotel_net_rates')){
                $query['searchRQ']['inputs']['hotelonly'] = true;
            }

            $promises['hotels'] = $this->_apiClient->requestAsync('POST', $this->baseHotelApiUrl. "search", [
                "query" => [
                    'q' => json_encode($query)
                ],
                "on_stats" => function(TransferStats $stats) use (&$transferTimes) {
                    $transferTimes['hotel'] = $stats->getTransferTime();
                }
            ]);

            if (boolval(env('APPLY_HOTELS_MARKUP'))) {
                $query = [
                    "searchRQ" => [
                        "version" =>  "v1",
                        "inputs" => [
                            "depDate" => $params['depDateHotel'] ?? $params['depDate'],
                            "retDate" => $params['retDateHotel'] ?? $params['retDate'],
                            "destination" => $params['destination']['cityId'],
                            "packageId" => strpos($params['selectedProducts'], 'F') !== false ? 1 : 2,
                            "site" => config('site.index'),
                        ]
                    ]
                ];


                $promises['hotels.markup'] = $this->_apiClient->requestAsync('GET', $this->baseMarkupApiUrl."hotel", [
                    "query" => [
                        'q' => json_encode($query),
                    ],
                    "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                        $transferTimes['hotel.markup'] = $stats->getTransferTime();
                    }
                ]);
            } else {
                $responses['hotels.markup'] = ($params['selectedProducts'] == 'FH') ? config('markup.default.flight_hotel') : config('markup.default.hotel');
            }
        }

        if (in_array('flights', $products)) {
            $pax = [ "adults" => 0, "children" => 0, "ages" => [] ];

            foreach ($params['occupancy'] as $room) {
                $pax['adults'] += $room['adults'];
                foreach ($room['ages'] as $child) {
                    if ($child < 12) {
                        $pax['children'] += 1;
                        $pax['ages'][] = $child;
                    } else {
                        $pax['adults'] += 1;
                    }
                }
            }
            $slices = [
                [
                    "origin" => $params['departure']['value'],
                    "destination" => $params['destination']['value'],
                    "date" => $params['depDate']
                ],
                [
                    "origin" => $params['destination']['value'],
                    "destination" => $params['departure']['value'],
                    "date" => $params['retDate']
                ]
            ];

            $query = [
                "searchRQ" => [
                    "version" =>  "v1",
                    "siteId" => config('site.flt_affiliate'),
                    "inputs" => [
                        "tripType" => $params['trip'],
                        "cabinType" => $params['cabinType'],
                        "nearbyAirports" => "1",
                        "transat" => "0",
                        "nonStop" => "0",
                        "pax" => $pax,
                        "slices" => $slices,
                        // add in private fare field
                    ]
                ]
            ];

            if (!empty($params['hotels'])) {
                // need to add something here to set flag for no nets on standalone product
            }

            if (empty($params['refundable'])) {
                $promises['flights'] = $this->_apiClient->requestAsync('POST', $this->baseFlightApiUrl."search", [
                    "query" => [
                        'q' => json_encode($query),
                    ],
                    "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                        $transferTimes['flight'] = $stats->getTransferTime();
                    }
                ]);
            }

            $promises['flights-refundable'] = $this->_apiClient->requestAsync('POST', ($this->baseFlightRefundableApiUrl)."search", [
                "query" => [
                    'q' => json_encode($query),
                ],
                "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                    $transferTimes['flight'] = $stats->getTransferTime();
                }
            ]);

            if (boolval(env('APPLY_FLIGHTS_MARKUP'))) {
                $query = [
                    "searchRQ" => [
                        "version" =>  "v1",
                        "inputs" => [
                            "depDate" => $params['depDate'],
                            "departure" => $slices[0]['origin'],
                            "destination" => $slices[0]['destination'],
                            "packageId" => 1,
                            "retDate" => $params['retDate'],
                            "site" => config('site.index'),
                            "tripType" => "round"
                        ]
                    ]
                ];

                $promises['flights.markup'] = $this->_apiClient->requestAsync('GET', $this->baseMarkupApiUrl."flight", [
                    "query" => [
                        'q' => json_encode($query),
                    ],
                    "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                        $transferTimes['flight.markup'] = $stats->getTransferTime();
                    }
                ]);
            } else {
                $responses['flights.markup'] = config('markup.default.flight');
            }
        }

        if (in_array('cars', $products)) {
            $query = [
                "searchRQ" => [
                    "inputs" => [
                        "driverAge" => "30",
                        "pickup" => [
                            "date" => $params['depDateCar'] ?? $params['depDate'],
                            "IATA" => $params['carPickup'] ?? $params['destination']['value'],
                            "time" => $params['carPickupTime'] ?? "10:00"
                        ],
                        "dropoff" => [
                            "date" => $params['retDateCar'] ?? $params['retDate'],
                            "IATA" => $params['carDropoff'] ?? $params['destination']['value'],
                            "time" => $params['carDropoffTime'] ?? "10:00"
                        ],
                        "flush" => 0,
                    ],
                    "version" => "v1"
                ],
                "session" => [
                    "lan" => "en"
                ]
            ];

            $promises['cars'] = $this->_apiClient->requestAsync('post', config('api.car').'search', [
                "body" => json_encode($query),

            ]);
        }

        $results = Promise\settle($promises)->wait();

        foreach ($results as $key => $response) {
            try {
                $responses[$key] = json_decode($response['value']->getBody(), true);
            }catch (\Exception $e) {
                $responses[$key] = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
            }
        }

        $transferTimes['end'] = microtime();
        return [$responses, $transferTimes];
    }

    public function filterHotelBySearch($hotelIds,$params)
    {
        $destination = $params['destination'];
        $hotelSearch = $params['hotelSearch'];
        $promises = [];
        $responses = [];
        $query = [
            "query" => $hotelSearch,
            "latitude" => $destination['latitude'],
            "longitude" => $destination['longitude'],
            "clientRefIds" => $hotelIds,
            "preserveOrder" => true,
            "reviewsSampleSize" => 4,
            "offset" => 0,
            "limit" => count($hotelIds)
        ];
        $header= array(
            'headers' => [
                'Authorization' => 'Bearer 8242f622-672f-4bb1-ae12-f243e02cd3da',
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($query)
        );


        try {
            $response = $this->_apiClient->request('POST', config('api.hotel_search_text').'hotels/light-search', $header);
            $data = json_decode($response->getBody(), true);
            $log = new  DiviniaLogs;

            $log->request = json_encode($header);
            $log->response = json_encode($data);

            $log->save();
        }catch (\Exception $e) {
            $data = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
        }

        return $data;
    }

    public function autocomplete($term = '')
    {
        if(\Cache::get('origin-exclusions') === null) {
            $response = $this->_apiClient->request('GET', $this->baseMarkupApiUrl."packageorigins", [
                "query" => [
                    "packageid" => 5
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            \Cache::put('origin-exclusions', $data, 1800);
        }


        $query = Airports::whereNotNull('latitude')
            ->whereNotNull('longitude');

        $terms = str_replace(",", " ", strtolower(htmlspecialchars($term, ENT_QUOTES, 'UTF-8')));
        $termList = explode(" ", $terms);

        foreach ($termList as $index => $term) {
            $query->where(function ($condition) use ($term) {
                $condition->where('name', 'LIKE', "%$term%")
                    ->orWhere('location', 'LIKE', "%$term%");

                if (strlen($term) === 3) {
                    $condition = $condition->orWhere('code', $term);
                }
            });
        }

        $query->orderBy('priority', 'DESC');
        $query->limit(25);
        $data = json_decode(json_encode($query->get()), true);

        return $data;
    }

    public function autosuggest($params)
    {

        // if(\Cache::get('destination-exclusions') === null) {
            $response = $this->_apiClient->request('GET', $this->baseMarkupApiUrl."destinationAutocomplete", [
                "query" => [
                    "q" => $params['filter']
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            // \Cache::put('destination-exclusions', $data, 1800);
        // }

        // $response = $this->_apiClient->request('GET', $this->baseHotelApiUrl."autosuggest", [
        //     "query" => [
        //         'q' => $term,
        //         'limit' => 5,
        //     ]
        // ]);

        // $data = json_decode($response->getBody(), true);
        return $data;
    }


    public function hotelDeal($params, $products)
    {
        $query = '{
            "detailsRQ": {
                "version": "v1",
                "inputs": {
                    "noCache": true,
                    "userIp": "'.$this->ip.'",
                    "userAgent": "'.$_SERVER['HTTP_USER_AGENT'].'",
                    "searchparams": {
                        "HotelID": "' . $params['hotelID'] .'",
                        "rooms": ' . json_encode($params['occupancy']) . ',
                        "depDate": "' . $params['depDate'] .'",
                        "arrDate": "' . $params['retDate'] .'",
                        "vendor": "' . $params['vendor'] .'",
                        "cur": "'. config('app.currency') .'",
                        '.(($params['refundable'])?'"refundable":true,':'').'
                        "lang": "'. $params['lang'] .'"
                    }
                }
            }
        }';

        $promises['hotel'] = $this->_apiClient->requestAsync('POST', $this->baseHotelApiUrl. "detail", [
            "query" => [
                'q' => $query
            ]
        ]);

        if (boolval(env('APPLY_HOTELS_MARKUP'))) {
            $query = [
                "searchRQ" => [
                    "version" =>  "v1",
                    "inputs" => [
                        "depDate" => $params['depDate'],
                        "retDate" => $params['retDate'],
                        "hotelId" => $params['hotelID'],
                        "destination" => $params['destination']['cityId'] ?? '',
                        "packageId" => strpos($params['selectedProducts'], 'F') !== false ? 1 : 2,
                        "site" => config('site.index'),
                    ]
                ]
            ];

            $promises['hotels.markup'] = $this->_apiClient->requestAsync('GET', $this->baseMarkupApiUrl."hotel", [
                "query" => [
                    'q' => json_encode($query),
                ],
                "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                    $transferTimes['hotel.markup'] = $stats->getTransferTime();
                }
            ]);
        } else {
            $responses['hotels.markup'] = config('markup.default.hotel');
        }


        if (in_array('flights', $products)) {
            $pax = [ "adults" => 0, "children" => 0, "ages" => [] ];

            foreach ($params['occupancy'] as $room) {
                $pax['adults'] += $room['adults'];
                foreach ($room['ages'] as $child) {
                    if ($child < 12) {
                        $pax['children'] += 1;
                        $pax['ages'][] = $child;
                    } else {
                        $pax['adults'] += 1;
                    }
                }
            }
            $slices = [
                [
                    "origin" => $params['departure']['value'],
                    "destination" => $params['destination']['value'],
                    "date" => $params['depDate']
                ],
                [
                    "origin" => $params['destination']['value'],
                    "destination" => $params['departure']['value'],
                    "date" => $params['retDate']
                ]
            ];

            $query = [
                "searchRQ" => [
                    "version" =>  "v1",
                    "siteId" => config('site.flt_affiliate'),
                    "inputs" => [
                        "tripType" => $params['trip'],
                        "cabinType" => $params['cabinType'],
                        "nearbyAirports" => "1",
                        "transat" => "0",
                        "nonStop" => "0",
                        "pax" => $pax,
                        "slices" => $slices,
                        // add in private fare field
                    ]
                ]
            ];

            if (!empty($params['hotels'])) {
                // need to add something here to set flag for no nets on standalone product
            }

            $promises['flights'] = $this->_apiClient->requestAsync('POST', (empty($params['refundable']) ? $this->baseFlightApiUrl : $this->baseFlightRefundableApiUrl)."search", [
                "query" => [
                    'q' => json_encode($query),
                ],
                "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                    $transferTimes['flight'] = $stats->getTransferTime();
                }
            ]);

            if (boolval(env('APPLY_FLIGHTS_MARKUP'))) {
                $query = [
                    "searchRQ" => [
                        "version" =>  "v1",
                        "inputs" => [
                            "depDate" => $params['depDate'],
                            "departure" => $slices[0]['origin'],
                            "destination" => $slices[0]['destination'],
                            "packageId" => 1,
                            "retDate" => $params['retDate'],
                            "site" => config('site.index'),
                            "tripType" => "round"
                        ]
                    ]
                ];

                $promises['flights.markup'] = $this->_apiClient->requestAsync('GET', $this->baseMarkupApiUrl."flight", [
                    "query" => [
                        'q' => json_encode($query),
                    ],
                    "on_stats" => function(TransferStats $stats) use(&$transferTimes) {
                        $transferTimes['flight.markup'] = $stats->getTransferTime();
                    }
                ]);
            } else {
                $responses['flights.markup'] = config('markup.default.flight');
            }
        }


        $results = Promise\settle($promises)->wait();

        foreach ($results as $key => $response) {
            try {
                $responses[$key] = json_decode($response['value']->getBody(), true);
            }catch (\Exception $e) {
                $responses[$key] = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
            }

        }
        return $responses;
    }

    public function hotelReviews($params)
    {

        $header= array(
            'headers' => [
                'Authorization' => 'Bearer 8242f622-672f-4bb1-ae12-f243e02cd3da',
                'Content-Type' => 'application/json'
            ],
            'query' => [
                'topicId' => $params['topicId'],
                'topicSentiment' => $params['sentiment'],
                'pageNumber' => $params['page'],
            ]
        );
        try {
            $response = $this->_apiClient->request('GET', config('api.hotel_search_text').'hotels/'.$params['id'].'/reviews', $header);
            $data = json_decode($response->getBody(), true);
        }catch (\Exception $e) {
            $data = [ "error" => [ "message" => "There was a communication error with our provider. please try again later."]];
        }

        return $data;
    }

    public function hotelDetails($sessionData, $params, $isRefundable=false)
    {

        $query = '{
             "session": {
                "id": "'.$sessionData['sessionID'].'"
            },
            "detailsRQ": {
                "version": "v1",
                "inputs": {
                    "noCache": true,
                    "resultsId": "'.$sessionData['resultsID'].'",
                    "rowId": "' . $params['rowIndex'] . '",
                    "lang": "'.$params['lang'].'",
                    "cur": "'.config('app.currency').'",
                    "userIp": "'.$this->ip.'",
                    '.(($isRefundable)?'"refundable":true,':'').'
                    "userAgent": ".'.$_SERVER['HTTP_USER_AGENT'].'"
                }
            }
        }';

        $response = $this->_apiClient->request('POST', $this->baseHotelApiUrl."detail", [
            "query" => [
                'q' => $query
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data;
    }
}
