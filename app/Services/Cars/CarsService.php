<?php

namespace App\Services\Cars;

use App\Repositories\Contracts\APIInterface;
use App\Models\CarBooking;
use App\Models\BookingHistory;

class CarsService
{
    protected $carsRepo;
    protected $topAmenities;

    public function __construct(APIInterface $carsRepo)
    {
        $this->carsRepo = $carsRepo;
    }

    public function translateSearch($results, $prices, $isIncremental, $numTravellers)
    {
        // dd($results);
        $grid = [];
        foreach ($results['extras']['filters']['category'] as $category) {
            $grid[$category] = [];
            foreach ($results['extras']['filters']['operator'] as $vendor) {
                $grid[$category][$vendor] = null;
            }
        }

        $cheapest = [];
        $cars = [];
        foreach($results['rows'] as $row) {
            $rate = $row['rates'][0];
            // unset($row['rates']);

            $car = $row;

            $rate['rate'] = intval($rate['total'] / $numTravellers);
            $car["ratePerPerson"] = $rate['rate'];
            foreach ($prices as $key => $value) {
                if ($key != 'car`') {
                    $car['ratePerPerson'] += $value['fare'];
                }
            }

            $car['rates'] = [];
            foreach ($row['rates'] as $rateData) {

                $rate = intval($rateData['total'] / $numTravellers);
                if($isIncremental) {
                    $rate -= floor($prices['car']['fare']);
                }
                $car['rates'][] = [
                    'rate' => $rate,
                    'rateDescription' => $rateData['description'],
                    'rateIncluded' => $rateData['included'],
                    'rateExcluded' => $rateData['excluded'],
                    'rateInclusive' => $rateData['inclusive'],
                ];
            }

            $car['pickup'] = $results['extras']['locations'][$row['puLocId']];
            $car['dropoff'] = $results['extras']['locations'][$row['doLocId']];

            $cars[] = $car;

            if(!isset($cheapest[$car['class']]) || $cheapest[$car['class']] > $car['rates'][0]['rate']) {
                $cheapest[$car['class']] = $car['rates'][0]['rate'];
            }

            if(empty($grid[$car['class']][$car['vendor']]) || $grid[$car['class']][$car['vendor']]['rate'] > $car['rates'][0]['rate']) {
                $grid[$car['class']][$car['vendor']] = [
                    "rate" => $car['rates'][0]['rate'],
                    "cheapest" => false,
                ];
            }
        }

        foreach ($grid as $category => &$vendors) {
            foreach ($vendors as &$vendor) {
                if($vendor !== null && $vendor['rate'] === $cheapest[$category]) {
                    $vendor['cheapest'] = true;
                }
            }
        }

        return [$cars, $grid];
    }

    public function filter($results, $params = [])
    {
        $cars = [];
        if (is_null($results) || !count($results)) {
            return $cars;
        }

        foreach ($results as $index => $car) {
            $valid = true;

            if (!empty($params['operator'])) {
                if (!in_array(\strval($car['vendor']), $params['operator'])) {
                    $valid = false;
                }
            }

            if(!empty($params['category'])) {
                if(!in_array($car['class'], $params['category'])) {
                    $valid = false;
                }
            }

            if(!empty($params['transmisson'])) {
                if(!in_array($car['transmisson'], $params['transmisson'])) {
                    $valid = false;
                }
            }

            if(!empty($params['size'])) {
                if(!in_array($car['size'], $params['size'])) {
                    $valid = false;
                }
            }

            if($valid === true) {
                $cars[] = $index;
            }
        }

        if (!empty($params['sort'])) {
            usort($cars, function($aIndex, $bIndex) use ($params, $results) {
                $response = 0;
                $a = $results[$aIndex];
                $b = $results[$bIndex];
                if ($params['sort'] === 'size') {
                    if ($a['size'] < $b['size']) {
                        $response = -1;
                    } elseif ($a['size'] > $b['size']) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 'vend') {
                    if ($a['vendor'] < $b['vendor']) {
                        $response = -1;
                    } elseif ($a['vendor'] > $b['vendor']) {
                        $response = 1;
                    }
                } elseif ($params['sort'] === 'price') {
                    if($a['rate'] < $b['rate']) {
                        $response = -1;
                    } elseif ($a['rate'] > $b['rate']) {
                        $response = 1;
                    }
                }
                return $response;
            });
        }


        return $cars;
    }

    public function getTerms($sid, $resultId)
    {
        $terms = $this->carsRepo->getTerms($sid, $resultId);

        $terms['terms'] = $terms['terms']['carResults']['terms'];
        return $terms;
    }

    public function book($params, $bookingID)
    {
        list($request, $data) = $this->carsRepo->book($params);

        $history = new BookingHistory;

        $history->action = 'car';
        $history->booking_id = $bookingID;
        $history->request = $request;
        $history->response = $data;

        $history->save();


        $respData = json_decode($data, true);
        return isset($respData['cartResult']) ? $respData['cartResult']['bookingInfo']['car'] : $respData;
    }

    public function getBookingResponse($data)
    {
        $car = $data['verifyResult']['products']['car'];

        $response = [
            "bookingNumber" => isset($data['bookingResult']) ? $data['bookingResult']['confirmationNumber'] : 'PENDING',
            "referenceNumber" => isset($data['bookingResult']) ? $data['bookingResult']['reservationNumber'] : 'PENDING',
            "name" => $car['rentalInfo']['name'],
            "vendor" => $car['rentalInfo']['vendor'],
            "image" => $car['rentalInfo']['image'],
            "passengers" => $car['rentalInfo']['passengers'],
            "doors" => $car['rentalInfo']['doors'],
            "transmission" => $car['rentalInfo']['transmission'],
            "pickup" => $car['extras']['locations'][$car['rentalInfo']['puLocId']],
            "dropoff" => $car['extras']['locations'][$car['rentalInfo']['doLocId']],
            "pickupDateTime" => $car['searchParam']['pickupDate'].' '.$car['searchParam']['pickupTime'],
            "dropoffDateTime" => $car['searchParam']['dropoffDate'].' '.$car['searchParam']['dropoffTime'],
        ];

        $response['total'] = $car['rateInfo']['total'];
        $response['taxes'] = $car['rateInfo']['tax'];
        $response['subTotal'] = $car['rateInfo']['total'] - $car['rateInfo']['tax'];
        $response['markupCommission'] = 0;

        return $response;
    }

    public function logBooking($data, $bookingID)
    {
        $response = $this->getBookingResponse($data);

        $flightBooking = new CarBooking;

        $flightBooking->car_booking_number = $response['bookingNumber'];
        $flightBooking->booking_id = $bookingID;
        $flightBooking->booking_data = json_encode($response);
        $flightBooking->booking_status = 1;
        $flightBooking->active = 1;

        $flightBooking->save();

        return $response;
    }
}
