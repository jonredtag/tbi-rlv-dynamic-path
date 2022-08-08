<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\GuzzleException;
use App\Models\RefundableFlights;

class RefundableRepository {
    public function __construct()
    {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
            ]
        );
    }

    public function Gateways($term)
    {
        if(\Cache::get('origin-exclusions') === null) {
            $response = $this->_apiClient->request('GET', config('api.dashboard-feeds')."packageorigins", [
                "query" => [
                    "packageid" => 5
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            \Cache::put('origin-exclusions', $data, 1800);
        }

        $airports = [
            'YYZ' => [
                'code' => "YYZ",
                'name' => "Lester B. Pearson International Airport",
                'location' => "Toronto, Ontario, Canada",
                'latitude' => '43.6772',
                'longitude' => '-79.6306',
            ],
            'YUL' => [
                'code' => "YUL",
                'name' => "Montreal / Pierre Elliott Trudeau International Airport",
                'location' => "Montreal, Quebec, Canada",
                'latitude' => '45.4706',
                'longitude' => '-73.7408',
            ],
            'YVR' => [
                'code' => "YVR",
                'name' => "Vancouver International Airport",
                'location' => "Vancouver, British Columbia, Canada",
                'latitude' => '49.195',
                'longitude' => '-123.18194444444',
            ],
            'YYC' => [
                'code' => "YYC",
                'name' => "Calgary International Airport",
                'location' => "Calgary, Alberta, Canada",
                'latitude' => '51.113888888889',
                'longitude' => '-114.02027777778',
            ],
            'YHZ' => [
                'code' => "YHZ",
                'name' => "Halifax Stanfield International Airport",
                'location' => "Halifax, Nova Scotia, Canada",
                'latitude' => '44.880833333333',
                'longitude' => '-63.508611111111',
            ],
            'YOW' => [
                'code' => "YOW",
                'name' => "Ottawa Macdonald-Cartier Intl Airport",
                'location' => "Ottawa, Ontario, Canada",
                'latitude' => '45.3225',
                'longitude' => '-75.669166666667',
            ],
            'YQB' => [
                'code' => "YQB",
                'name' => "Jean Lesage Intl Airport",
                'location' => "Quebec City, Quebec, Canada",
                'latitude' => '46.788333333333',
                'longitude' => '-71.3975',
            ],
            'YYT' => [
                'code' => "YYT",
                'name' => "St John`s Intl Airport",
                'location' => "St. John's, Newfoundland and Labrador, Canada",
                'latitude' => '47.618611111111',
                'longitude' => '-52.751944444444',
            ]
        ];

        $data = [];
        foreach ($airports as $airport) {
            if ($term === '' || (strtolower($airport['code']) === strtolower($term) || strpos(strtolower($airport['name']), strtolower($term)) !== false || strpos(strtolower($airport['location']), strtolower($term)) !== false)) {
                $data[] = $airport;
            }
        }

        return $data;
    }

    public function Destinations($param)
    {
        $airports = [
            [
                'iata' =>  "PVR",
                'name' => "Puerto Vallarta",
                'state' => "Jalisco",
                'country' => "Mexico",
                'ID' => '800026743',
                'latitude' => '20.6801',
                'longitude' => '-105.254',
            ],
            [
                'iata' => "SJD",
                'name' => "Los Cabos",
                'state' => '',
                'country' => "Mexico",
                'ID' => '800097859',
                'latitude' => '23.1518',
                'longitude' => '-109.721',
            ],
            [
                'iata' => "CUN",
                'name' => "Cancun",
                'state' => "Quintana Roo",
                'country' => "Mexico",
                'ID' => "800026864",
                'latitude' => '21.040457',
                'longitude' => '-86.874435',
            ],
            [
                'iata' =>  "FLL",
                'name' => "Fort Lauderdale",
                'state' => "Florida",
                'country' => "United States",
                'ID' => '800047348',
                'latitude' => '26.0725',
                'longitude' => '-80.1525',
            ],
            [
                'iata' => "MCO",
                'name' => "Orlando",
                'state' => "Florida",
                'country' => "United States",
                'ID' => '800047448',
                'latitude' => '28.428888888889',
                'longitude' => '-81.315833333333',
            ],
            [
                'iata' => "MIA",
                'name' => "Miami",
                'state' => "Florida",
                'country' => "United States",
                'ID' => "800047418",
                'latitude' => '25.793055555556',
                'longitude' => '-80.290555555556',
            ],
            [
                'iata' => "MBJ",
                'name' => "Montego Bay",
                'state' => "Montego Bay",
                'country' => "Jamaica",
                'ID' => "800002582",
                'latitude' => '18.4721',
                'longitude' => '-77.9218',
            ],
            [
                'iata' => "BGI",
                'name' => "Barbados",
                'state' => "",
                'country' => "Barbados",
                'ID' => "800003061",
                'latitude' => '13.1667',
                'longitude' => '-59.55',
            ],
            [
                'iata' => "LAS",
                'name' => "Las Vegas",
                'state' => "Nevada",
                'country' => "United States",
                'ID' => "800049030",
                'latitude' => '36.119',
                'longitude' => '-115.168',
            ]
        ];

        list($gateway, $term) = explode('||', $param);
        return ['airports' => [], 'cities' => array_filter($airports, function($airport) use($term, $gateway) {
            $mapped = [
                'YYZ' => [ 'LAS','PVR', 'CUN', 'FLL', 'MCO', 'MIA', 'SJD', 'MBJ', 'BGI'],
                'YUL' => [ 'LAS','PVR', 'CUN', 'FLL', 'MCO', 'MIA', 'MBJ'],
                'YVR' => ['LAS','CUN', 'PVR', 'SJD'],
                'YYC' => ['LAS','CUN', 'PVR', 'SJD'],
                'YHZ' => ['CUN'],
                'YQB' => ['CUN'],
                'YYT' => ['CUN'],
                'YOW' => ['CUN', 'PVR']
            ];

            return (in_array($airport['iata'], $mapped[$gateway]) && ($term === '' || (strtolower($airport['iata']) === strtolower($term) || strpos(strtolower($airport['name']), strtolower($term)) !== false || strpos(strtolower($airport['state'].$airport['country']), strtolower($term)) !== false)));
        })];
    }

    public function getDates($params)
    {
        $departures = [
            'YYZ' => ['YYZ', 'YTO'],
            'YUL' => ['YUL', 'YMQ'],
            'YVR' => ['YVR'],
            'YYC' => ['YYC'],
            'YHZ' => ['YHZ'],
            'YQB' => ['YQB'],
            'YYT' => ['YYT'],
            'YOW' => ['YOW']
        ];

        $query = RefundableFlights::select(\DB::raw('gpDateDep AS date, GROUP_CONCAT(DATEDIFF(gpDateRet, gpDateDep)) AS duration'))
            ->whereIn('gpOrigine', $departures[$params['origin']]);

        if (!empty($params['destination'])) {
            $query = $query->where('gpDestination', 'LIKE', '%'.($params['destination'] !== 'undefined' ? $params['destination'] : '').'%');
        }

        $results = $query->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        $data = [];
        foreach ($results as $row) {
            $data[] = ['date' => $row['date'], 'durations' => array_unique(explode(',', $row['duration']))];
        }

        return $data;
    }
}
