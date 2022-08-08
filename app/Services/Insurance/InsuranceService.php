<?php

namespace App\Services\Insurance;

use App\Models\InsuranceBooking;

class InsuranceService
{
	protected $insurRepo;

	public function __construct($insurRepo)
	{
		$this->insurRepo = $insurRepo;
	}

	public function getQuote($searchParameters, $prices, $passengerData = [])
	{
		$request = $searchParameters;
		$cost = 0;
		$request['lang'] = 'en';
		$request['province'] = $passengerData['province'] ?? 'ON';
		$request['passengers'] = [];
		foreach ($prices as $price) {
			$cost += $price['fare'];
		}
		if(!empty($passengerData['passengers'])) {
			$passengers = json_decode($passengerData['passengers'], true);
			foreach ($passengers as $index => $passengerData) {
				$passenger = [
                    "passengerId" => $index,
                    // "firstName" => $passenger['first'],
                    // "lastName" => $passenger['last'],
                    "tripValue" => $cost,
                	"birthDate" => $passengerData['year'].'-'.$passengerData['month'].'-'.$passengerData['day'],
                ];

                $request['passengers'][] = $passenger;
			}
		} else {
			$travellerCount = 0;

			$passengers = [ "adults" => 0, 'ages' => [] ];
            foreach ($searchParameters['occupancy'] as $room) {
                $passengers['adults'] += $room['adults'];
                $passengers['ages']  = array_merge($passengers['ages'], $room['ages']);
            }

	        for ($i = 0; $i < $passengers['adults']; $i++) {
                $passenger = [
                    "passengerId" => $travellerCount++,
                    // "firstName" => $passenger['first'],
                    // "lastName" => $passenger['last'],
                    "tripValue" => $cost,
                	"birthDate" => date('Y-m-d', strtotime('-30 years')),
                ];

                $request['passengers'][] = $passenger;
            }
            foreach ($passengers['ages'] as $age) {
            	$passenger = [
                    "passengerId" => $travellerCount++,
                    // "firstName" => $passenger['first'],
                    // "lastName" => $passenger['last'],
                    "tripValue" => $cost,
                	"birthDate" => date('Y-m-d', strtotime("-$age years")),
                ];

                $request['passengers'][] = $passenger;
            }
		}

		$data = $this->insurRepo->getQuote($request);

        if(isset($data['error'])) {
            $data['error'] = ["message" => $data['error']];
        }

		return $data;
	}

    public function book($data)
    {
        $plans = [];
        $passengers = [];
        foreach ($data['passengerInformation'] as $index => $passenger) {
            if($passenger['plan'] !== 'DECLINED') {
                foreach ($data['insuranceInformation']['plans'] as $plan) {
                    if($passenger['plan'] == $plan['planCode']) {
                        break;
                    }
                }

                if(!array_key_exists($plan['planCode'], $plans)) {
                    $plans[$plan['planCode']] = [
                        "code" => $plan['planCode'],
                        "passengers" => []
                    ];
                }

                $plans[$plan['planCode']]['passengers'][] = [
                    "id" => $index+1
                ];

                $passengerData = [
                    "dob" => $passenger['year'].'-'.$passenger['month'].'-'.$passenger['day'],
                    "id" => $index + 1,
                    "value" => ($index+1).':'.$passenger['plan'].':'.$plan['passengers'][$index]['planTotal'],
                    "name" => [
                        "first" => $passenger['first'],
                        "last" => $passenger['last'],
                    ],
                ];

                $passengers[] = $passengerData;
            }
        }

        $response = [];
        if(count($plans) > 0) {

            $response = $this->insurRepo->book($data, array_values($plans), $passengers);
        }

        return $response;
    }

    public function logBooking($data, $bookingID)
    {
        $response = [
            "bookingNumber" => $data['bookingData']['number'] ?? 'Pending',
            'total' => $data['insuranceSummary']['total'],
            'taxes' => $data['insuranceSummary']['taxes'],
            'subTotal' => $data['insuranceSummary']['base'],
        ];

        $passengers = [];



        foreach ($data['passengerInformation'] as $index => $passenger) {
            $planName = 'Declined';
            $cost = 0;
            if($passenger['plan'] !== 'DECLINED') {
                foreach ($data['insuranceInformation']['plans'] as $plan) {
                    if($passenger['plan'] == $plan['planCode']) {
                        $planName = $plan['planName'];
                        $cost = floatval($plan['passengers'][$index]['planTotal']);
                        break;
                    }
                }
            }

            $passengers[$index + 1] = [
                "plan" => $planName,
                "cost" => $cost,
            ];
        }

        $response['passengers'] = $passengers;

        $insuranceBooking = new InsuranceBooking;

        $insuranceBooking->insurance_booking_number = $response['bookingNumber'];
        $insuranceBooking->booking_id = $bookingID;
        $insuranceBooking->booking_data = json_encode($response);
        $insuranceBooking->booking_status = 1;
        $insuranceBooking->active = 1;

        $insuranceBooking->save();

        return $response;
    }
}
