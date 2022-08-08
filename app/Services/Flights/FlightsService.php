<?php

namespace App\Services\Flights;

use App\Models\FlightBooking;
use App\Repositories\Contracts\APIInterface;
use App\Models\BookingHistory;

class FlightsService
{
    protected $flightsRepo;

    public function __construct(APIInterface $flightsRepo)
    {
        $this->flightsRepo = $flightsRepo;
    }

    public function filter($results, $params, &$prices, $numTravellers, $selectedCabin, $isIncremental)
    {
        if (empty($results['rows'])) {
            return [];
        }

        $minDeparture = $results['extras']['filters']['departure']['minDeparture'];
        $maxDeparture = $results['extras']['filters']['departure']['maxDeparture'];
        $minArrival = $results['extras']['filters']['arrival']['minArrival'];
        $maxArrival = $results['extras']['filters']['arrival']['maxArrival'];

        $flights = [];

        foreach ($results['rows'] as $flight) {
            $valid = true;
            $out_slice = $results['extras']['slices'][$flight['itineraries'][0]];
            $in_slice = $results['extras']['slices'][$flight['itineraries'][1]];
            if (!empty($params['price'])) {
                $rate = $flight['priceInfo']['cheapest']['saleTotal']['amount'];
                if ($isIncremental) {
                    $rate -= $prices['flight']['fare'];
                } else {
                    foreach ($prices as $key => $price) {
                        if ($key !== 'flight') {
                            $rate += $price['fare'];
                        }
                    }
                }
                if (ceil($rate) < $params['price'][0] || $rate > $params['price'][1]) {
                    $valid = false;
                }
            }

            if (!empty($params['duration']) && count($params['duration']) === 2) {
                $valid = $valid && ($out_slice['duration'] >= $params['duration'][0] && $out_slice['duration'] <= $params['duration'][1]);
            }

            if (!empty($params['departureTimes']) && count($params['departureTimes']) > 0) {
                // stopValue = 0-0 or 0-1...
                $departureValid = [];
                foreach ($params['departureTimes'] as $departureValue) {
                    $timeSplit = explode('-', $departureValue);
                    // 00:00 - 04:59
                    $legDep = $out_slice['segments'][0]['legs'][0]['departure'];
                    $legDepartureParts = explode('T', $legDep);
                    $legDepartureTime = intval($this->flightsRepo->convertToTime($legDep, 'U'));
                    $filterTimeStart = strtotime(implode('T', [$legDepartureParts[0], $timeSplit[0] . ':00']));
                    $filterTimeEnd = strtotime(implode('T', [$legDepartureParts[0], $timeSplit[1] . ':00']));
                    // && $filterTimeStart > $minDeparture && $filterTimeEnd < $maxDeparture
                    if ($legDepartureTime >= $filterTimeStart && $legDepartureTime <= $filterTimeEnd) {
                        $departureValid[] = true;
                    }
                }
                $valid = $valid && in_array(true, $departureValid, true);
            }

            if (!empty($params['inboundDepartureTimes']) && count($params['inboundDepartureTimes']) > 0) {
                // stopValue = 0-0 or 0-1...
                $inboundDepartureValid = [];
                foreach ($params['inboundDepartureTimes'] as $departureValue) {
                    $timeSplit = explode('-', $departureValue);
                    // 00:00 - 04:59
                    $legInboundDep = $in_slice['segments'][0]['legs'][0]['departure'];
                    $legInboundDepartureParts = explode('T', $legInboundDep);
                    $legInboundDepartureTime = intval($this->flightsRepo->convertToTime($legInboundDep, 'U'));
                    $filterTimeStart = strtotime(implode('T', [$legInboundDepartureParts[0], $timeSplit[0] . ':00']));
                    $filterTimeEnd = strtotime(implode('T', [$legInboundDepartureParts[0], $timeSplit[1] . ':00']));
                    // && $filterTimeStart > $minDeparture && $filterTimeEnd < $maxDeparture
                    if ($legInboundDepartureTime >= $filterTimeStart && $legInboundDepartureTime <= $filterTimeEnd) {
                        $inboundDepartureValid[] = true;
                    }
                }
                $valid = $valid && in_array(true, $inboundDepartureValid, true);
            }

            if (!empty($params['arrivalTimes']) && count($params['arrivalTimes']) > 0) {
                // stopValue = 0-0 or 0-1...
                $arrivalValid = [];
                foreach ($params['arrivalTimes'] as $arrivalValue) {
                    $timeSplit = explode('-', $arrivalValue);
                    // 00:00 - 04:59
                    $lastSegment = $out_slice['segments'][count($out_slice['segments']) - 1];
                    $legArr = $lastSegment['legs'][count($lastSegment['legs']) - 1]['arrival'];
                    $legArrivalParts = explode('T', $legArr);
                    $legArrivalTime = intval($this->flightsRepo->convertToTime($legArr, 'U'));
                    $filterTimeStart = strtotime(implode('T', [$legArrivalParts[0], $timeSplit[0] . ':00']));
                    $filterTimeEnd = strtotime(implode('T', [$legArrivalParts[0], $timeSplit[1] . ':00']));
                    // && $filterTimeStart > $minArrival && $filterTimeEnd < $maxArrival
                    if ($legArrivalTime >= $filterTimeStart && $legArrivalTime <= $filterTimeEnd) {
                        $arrivalValid[] = true;
                    }
                }
                $valid = $valid && in_array(true, $arrivalValid, true);
            }

            if (!empty($params['inboundArrivalTimes']) && count($params['inboundArrivalTimes']) > 0) {
                // stopValue = 0-0 or 0-1...
                $inboundArrivalValid = [];
               
                foreach ($params['inboundArrivalTimes'] as $i => $inboundArrivalValue) {
                    $timeSplit = explode('-', $inboundArrivalValue);
                    // 00:00 - 04:59               
                   // $lastSegment = $in_slice['segments'][count($out_slice['segments']) - 1];
                    $lastSegment = $in_slice['segments'][count($in_slice['segments']) - 1];                    
                    $inboundLegArr = $lastSegment['legs'][count($lastSegment['legs']) - 1]['arrival'];
                    $inboundLegArrivalParts = explode('T', $inboundLegArr);
                    $inboundLegArrivalTime = intval($this->flightsRepo->convertToTime($inboundLegArr, 'U'));
                    $filterTimeStart = strtotime(implode('T', [$inboundLegArrivalParts[0], $timeSplit[0] . ':00']));
                    $filterTimeEnd = strtotime(implode('T', [$inboundLegArrivalParts[0], $timeSplit[1] . ':00']));

                    if ($inboundLegArrivalTime >= $filterTimeStart && $inboundLegArrivalTime <= $filterTimeEnd) {
                        $inboundArrivalValid[] = true;
                    }
                   
                }
                    $valid = $valid && in_array(true, $inboundArrivalValid, true);
            }
                
            if (!empty($params['outboundSegmentKey'])) {
                if (!in_array($params['outboundSegmentKey'], $flight['itineraries'])) {
                    $valid = false;
                }
            }
            
            if (!empty($params['inboundSegmentKey'])) {
                if (!in_array($params['inboundSegmentKey'], $flight['itineraries'])) {
                    $valid = false;
                }
            }
            
                // if (isset($params['noOfStops']) && count($params['noOfStops']) > 0) {
                    //     // stopValue = 0-0 or 0-1...
                    //     $stopsValid = [];
                    //     foreach ($params['noOfStops'] as $stopValue) {
                        //         $stops = explode('-', $stopValue);
                        //         $outStop = $stops[0];
                        //         $inStop = $stops[1];
            //         // range must match both out and in slices
            //         if ($outStop == $out_slice['stopCount'] && $inStop == $in_slice['stopCount']) {
            //             $stopsValid[] = true;
            //         }
            //     }
            //     $valid = $valid && in_array(true, $stopsValid, true);
            // }
            
            if (isset($params['noOfStopsOut']) && count($params['noOfStopsOut']) > 0) {
                // stopValue = 0-0 or 0-1...
                $stopsValid = [];
                foreach ($params['noOfStopsOut'] as $stopValue) {
                    // range must match both out and in slices
                    if ($stopValue == $out_slice['stopCount']) {
                        $stopsValid[] = true;
                    }
                }
                $valid = $valid && in_array(true, $stopsValid, true);
            }
            
            if (isset($params['noOfStopsIn']) && count($params['noOfStopsIn']) > 0) {
                // stopValue = 0-0 or 0-1...
                $stopsValid = [];
                foreach ($params['noOfStopsIn'] as $stopValue) {
                    // range must match both out and in slices
                    if ($stopValue == $in_slice['stopCount']) {
                        $stopsValid[] = true;
                    }
                }
                $valid = $valid && in_array(true, $stopsValid, true);
            }
            
            
            if (isset($params['carriers']) && count($params['carriers']) > 0) {
                $carrierValid = [];
                foreach ($params['carriers'] as $airline) {
                    // range must match both out and in slices
                    foreach ($out_slice['segments'] as $segment) {
                        if ($segment['flight']['carrier'] == $airline) {
                            $carrierValid[] = true;
                        }
                    }
                    // range must match both out and in slices
                    foreach ($in_slice['segments'] as $segment) {
                        if ($segment['flight']['carrier'] == $airline) {
                            $carrierValid[] = true;
                        }
                    }
                }
                $valid = $valid && in_array(true, $carrierValid, true);
            }
            
            if ($valid) {                
                $flights[] = $flight;
            }
        }

        // if (!empty($params['sort'])) {
        //     usort($flights, function($a, $b) use ($params) {
        //         $response = 0;

        //         if ($params['sort'] === 'di') {
        //             if ($a['distanceFrom'] < $b['distanceFrom']) {
        //                 $response = -1;
        //             } else if ($a['distanceFrom'] > $b['distanceFrom']) {
        //                 $response = 1;
        //             }
        //         } else if ($params['sort'] === 'p_lh') {
        //             if ($a['rate'] < $b['rate']) {
        //                 $response = -1;
        //             } else if ($a['rate'] > $b['rate']) {
        //                 $response = 1;
        //             }
        //         } else if ($params['sort'] === 'p_hl') {
        //             if ($a['rate'] < $b['rate']) {
        //                 $response = 1;
        //             } else if ($a['rate'] > $b['rate']) {
        //                 $response = -1;
        //             }
        //         } else if ($params['sort'] === 's_lh') {
        //             if ($a['rating'] < $b['rating']) {
        //                 $response = -1;
        //             } else if ($a['rating'] > $b['rating']) {
        //                 $response = 1;
        //             }
        //         } else if ($params['sort'] === 's_hl') {
        //             if ($a['rating'] < $b['rating']) {
        //                 $response = 1;
        //             } else if ($a['rating'] > $b['rating']) {
        //                 $response = -1;
        //             }
        //         }
        //         return $response;
        //     });
        // }

        return $this->translateFilteredResults($flights, $results['extras'], $prices, $numTravellers, $selectedCabin, $isIncremental);
    }

    public function searchCurrencyConversion($results, $currency)
    {
        foreach ($results['data']['flightResults']['rows'] as &$row) {
            $row['priceInfo']['cheapest']['saleFareTotal']['amount'] = app('currencyService')->convert($row['priceInfo']['cheapest']['saleFareTotal']['amount'], $currency);
            $row['priceInfo']['cheapest']['saleTaxTotal']['amount'] = app('currencyService')->convert($row['priceInfo']['cheapest']['saleTaxTotal']['amount'], $currency);
            $row['priceInfo']['cheapest']['saleTotal']['amount'] = app('currencyService')->convert($row['priceInfo']['cheapest']['saleTotal']['amount'], $currency);
        }

        foreach ($results['data']['flightResults']['extras']['aircrafts'] as &$row) {
            $row['price'] = app('currencyService')->convert($row['price'], $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['originDestination'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['destinationOrigin'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['alternativeAirportsOut'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['alternativeAirportsIn'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['price'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['carriers'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['filters']['stops'] as &$row) {
            $row = app('currencyService')->convert($row, $currency);
        }

        foreach ($results['data']['flightResults']['extras']['matrix'] as &$matrix) {
            foreach ($matrix as &$row) {
                $row = app('currencyService')->convert($row, $currency);
            }
        }

        return $results;
    }

    public function details($data, $itineraries)
    {
        $details = [];
        foreach ($itineraries as $itinerary) {
            $details[$itinerary] = $data['data']['flightResults']['extras']['slices'][$itinerary];
            $this->flightsRepo->getLegLayover($details[$itinerary]['segments']);

            foreach ($details[$itinerary]['segments'] as $index => $leg) {
                $details[$itinerary]['segments'][$index]['legs'][0]['arrival'] = $this->flightsRepo->convertToTime($leg['legs'][0]['arrival'], 'Y-m-d\TH:i:s');
                $details[$itinerary]['segments'][$index]['legs'][0]['departure'] = $this->flightsRepo->convertToTime($leg['legs'][0]['departure'], 'Y-m-d\TH:i:s');
            }
        }
        return $details;
    }

    public function buildFlightSummary($row, $extras, $selectedCabin)
    {
        $itinerary1 = $row['itineraries'][0];
        $itinerary2 = $row['itineraries'][1];
        $out_slice = $extras['slices'][$itinerary1];
        $in_slice = $extras['slices'][$itinerary2];

        $summaries = [];
        foreach ($row['itineraries'] as $key) {
            // inital vars
            $viaOutCount = 0;
            $notesArr = [];
            $itinerarySlicekey = '';
            $noOfAvailableSeats = [];
            $flightSummary = [];
            $first_outbound_segment = $out_slice['segments'][0];
            $last_outbound_segment = $out_slice['segments'][count($out_slice['segments']) - 1];
            $first_inbound_segment = $in_slice['segments'][0];
            $last_inbound_segment = $in_slice['segments'][count($in_slice['segments']) - 1];

            $first_outbound_leg = $first_outbound_segment['legs'][0];
            $last_outbound_leg = $last_outbound_segment['legs'][count($last_outbound_segment['legs']) - 1];
            $first_inbound_leg = $first_inbound_segment['legs'][0];
            $last_inbound_leg = $last_inbound_segment['legs'][count($last_inbound_segment['legs']) - 1];

            // split date/times START SEGMENT ***************************************************************************
            $splitter = explode('T', $first_outbound_leg['arrival']);
            $first_outbound_leg['arrivalDate'] = $splitter[0];
            $first_outbound_leg['arrivalTime'] = $this->flightsRepo->convertToTime($first_outbound_leg['arrival']);

            $splitter = explode('T', $last_outbound_leg['arrival']);
            $last_outbound_leg['arrivalDate'] = $splitter[0];
            $last_outbound_leg['arrivalTime'] = $this->flightsRepo->convertToTime($last_outbound_leg['arrival']);

            $splitter = explode('T', $first_outbound_leg['departure']);
            $first_outbound_leg['departureDate'] = $splitter[0];
            $first_outbound_leg['departureTime'] = $this->flightsRepo->convertToTime($first_outbound_leg['departure']);

            $splitter = explode('T', $last_outbound_leg['departure']);
            $last_outbound_leg['departureDate'] = $splitter[0];
            $last_outbound_leg['departureTime'] = $this->flightsRepo->convertToTime($last_outbound_leg['departure']);
            // split date/times START SEGMENT ***************************************************************************

            // split date/times END SEGMENT ******************************************************************************
            $splitter = explode('T', $first_inbound_leg['arrival']);
            $first_inbound_leg['arrivalDate'] = $splitter[0];
            $first_inbound_leg['arrivalTime'] = $this->flightsRepo->convertToTime($first_inbound_leg['arrival']);

            $splitter = explode('T', $last_inbound_leg['arrival']);
            $last_inbound_leg['arrivalDate'] = $splitter[0];
            $last_inbound_leg['arrivalTime'] = $this->flightsRepo->convertToTime($last_inbound_leg['arrival']);

            $splitter = explode('T', $first_inbound_leg['departure']);
            $first_inbound_leg['departureDate'] = $splitter[0];
            $first_inbound_leg['departureTime'] = $this->flightsRepo->convertToTime($first_inbound_leg['departure']);

            $splitter = explode('T', $last_inbound_leg['departure']);
            $last_inbound_leg['departureDate'] = $splitter[0];
            $last_inbound_leg['departureTime'] = $this->flightsRepo->convertToTime($last_inbound_leg['departure']);
            // split date/times END SEGMENT ******************************************************************************

            // dump($first_outbound_segment);

            /* duration */
            $durationDetails = [];
            if ($key == $itinerary1) {
                $durationDetails['duration'] = $out_slice['duration'];
                $durationDetails['formattedDuration'] = $this->flightsRepo->convertToDuration($out_slice['duration']);
                $flightSummary['flightNumber'] = $first_outbound_segment['flight']['number'];
                $flightSummary['flightCarrier'] = $first_outbound_segment['flight']['carrier'];
                $flightSummary['stopCount'] = (count($out_slice['segments']) - 1);

                $flightSummary['originDetails'] = array(
                    'origin' => $first_outbound_segment['origin'],
                    'departure' => $first_outbound_leg['departure'],
                    'departureTime' => $first_outbound_leg['departureTime'],
                    'departureDate' => $first_outbound_leg['departureDate'],
                );
                $flightSummary['destinationDetails'] = array(
                    'destination' => $last_outbound_segment['destination'],
                    'arrival' => $last_outbound_leg['arrival'],
                    'arrivalTime' => $last_outbound_leg['arrivalTime'],
                    'arrivalDate' => $last_outbound_leg['arrivalDate'],
                );
            } elseif ($key == $itinerary2) {
                $durationDetails['duration'] = $in_slice['duration'];
                $durationDetails['formattedDuration'] = $this->flightsRepo->convertToDuration($in_slice['duration']);
                $flightSummary['flightNumber'] = $first_inbound_segment['flight']['number'];
                $flightSummary['flightCarrier'] = $first_inbound_segment['flight']['carrier'];
                $flightSummary['stopCount'] = (count($in_slice['segments']) - 1);

                $flightSummary['originDetails'] = array(
                    'origin' => $first_inbound_segment['origin'],
                    'departure' => $first_inbound_leg['departure'],
                    'departureTime' => $first_inbound_leg['departureTime'],
                    'departureDate' => $first_inbound_leg['departureDate'],
                );
                $flightSummary['destinationDetails'] = array(
                    'destination' => $last_inbound_segment['destination'],
                    'arrival' => $last_inbound_leg['arrival'],
                    'arrivalTime' => $last_inbound_leg['arrivalTime'],
                    'arrivalDate' => $last_inbound_leg['arrivalDate'],
                );
            }
            $flightSummary['durationDetails'] = $durationDetails;
            /* duration */

            $flightSummary['cabins'] = [$first_outbound_leg['cabin'], $last_inbound_leg['cabin']];
            // $flightSummary['durationDetails']['duration'] = $OBOriginDestinationOption['ElapsedTime'];
            // $flightSummary['durationDetails']['formattedDuration'] = FlightsCommLibrary\CommonTranslate::convertToDuration($OBOriginDestinationOption['ElapsedTime']);
            // $flightSummary['numberOfDays'] = (strtotime(FlightsCommLibrary\CommonTranslate::removeTimeZone($last_inbound_segment['legs'][count($last_inbound_segment['legs']) - 1]['arrival'])) - strtotime(FlightsCommLibrary\CommonTranslate::removeTimeZone($first_outbound_segment['legs'][0]['departure']))) / (60 * 60 * 24);

            $classes = [
                "P" => 'Premium First Class',
                "F" => 'First Class',
                "J" => 'Premium Business Class',
                "C" => 'Business Class',
                "S" => 'Premium Economy Class',
            ];
            $availableCabin = [];

            foreach ($in_slice['segments'] as $segment) {
                foreach ($segment['legs'] as $leg) {
                    $availableCabin[] = $leg['cabin'];
                }
            }

            foreach ($out_slice['segments'] as $segment) {
                foreach ($segment['legs'] as $leg) {
                    $availableCabin[] = $leg['cabin'];
                }
            }

            if ($selectedCabin != 'Y' && count(array_diff($availableCabin, [$classes[$selectedCabin]])) > 0) {
                $flightSummary['notes'][] = '*Not all flight legs are in the class selected';
            }

            $summaries[$key] = $flightSummary;
        }
        // die;
        return $summaries;
    }

    public function translate($results, &$prices, $selectedCabin)
    {
        foreach ($results['data']['flightResults']['rows'] as &$row) {
            $row['flightSummaries'] = $this->buildFlightSummary($row, $results['data']['flightResults']['extras'], $selectedCabin);
            // $row['priceInfo']['rate'] = $row['priceInfo']['rate'] - $prices['flight']['fare'];
        }
        foreach ($results['data']['flightResults']['extras']['slices'] as &$slice) {
            $this->flightsRepo->getLegLayover($slice['segments']);
        }

        return $results['data'];
    }

    public function translateFilteredResults($rows, $extras, $prices, $numTravellers, $selectedCabin, $isIncremental)
    {
        $baseFare = 0;
        foreach ($prices as $key => $value) {
            $baseFare += $value['fare'];
        }
        $baseFare = max($baseFare, 0);
        foreach ($rows as &$row) {
            $row['flightSummaries'] = $this->buildFlightSummary($row, $extras, $selectedCabin);
            $rate = $row['priceInfo']['cheapest']['saleTotal']['amount'];
            if ($isIncremental) {
                $rate -= $prices['flight']['fare'];
            } else {
                foreach ($prices as $key => $price) {
                    if ($key !== 'flight') {
                        $rate += $price['fare'];
                    }
                }
            }
            $row['priceInfo'] = [
                "rate" => $rate,
                "baseRate" => $row['priceInfo']['cheapest']['saleFareTotal']['amount'] * $numTravellers,
                "taxes" => $row['priceInfo']['cheapest']['saleTaxTotal']['amount'] * $numTravellers,
                "rateTotalPerPerson" => $row['priceInfo']['cheapest']['saleTotal']['amount'],
            ];
            foreach ($prices as $key => $value) {
                if($key !== 'flight') {
                    $row['priceInfo']['baseRate'] += $value['base'];
                    $row['priceInfo']['taxes'] += $value['taxes'];
                    $row['priceInfo']['rateTotalPerPerson'] += $value['fare'];
                }
            }
        }

        return $rows;
    }

    public function translateDepartureFlight($flight)
    {
        $details = [
            "stops" => $flight['stopCount'],
            "key" => $flight['key'],
            "airports" => [],
            "price" => $flight['pricing']['saleTotal'],
            "carriers" => [],
            "classes" => [],
            "seats" => 10, //need to find the right value
            "travelTime" => $flight['duration'],
            "legs" => [],

            "departureTime" => intval((new \DateTime($flight['segments'][0]['legs'][0]['departure']))->format('H')),
            "flightDuration" => 0,
        ];

        foreach ($flight['segments'] as $index => $segment) {
            $legData = $segment['legs'][0];

            $leg = [
                "carrier" => $segment['flight']['carrier'],
                "origin" => $legData['origin'],
                "destination" => $legData['destination'],
                "departure" => substr($legData['departure'], 0, -6),
                "arrival" => substr($legData['arrival'], 0, -6),
                "flightNumber" => $segment['flight']['number'],
                "class" => !empty($legData['cabin']) ? $legData['cabin'] : 'Economy Class',
                "layover" => 0,
                "duration" => $legData['duration'],
            ];
            $details['flightDuration'] += $legData['duration'];

            $details['arrivalTime'] = intval((new \DateTime($legData['arrival']))->format('H'));

            $numSeats = isset($segment['bookingInfos'][0]['bookingCodeCount']) ? intval($segment['bookingInfos'][0]['bookingCodeCount']) : 10;
            if ($numSeats < $details['seats']) {
                $details['seats'] = $numSeats;
            }

            if (!in_array($leg['class'], $details['classes'])) {
                $details['classes'][] = $leg['class'];
            }

            if (!empty($legData['operationalDisclosure'])) {
                $leg['disclosure'] = $legData['operationalDisclosure']["disclosureText"];
            }

            if (!in_array($leg['carrier'], $details['carriers'])) {
                $details['carriers'][] = $leg['carrier'];
            }

            if (!in_array($leg['origin'], $details['airports'])) {
                $details['airports'][] = $leg['origin'];
            }

            if (!in_array($leg['destination'], $details['airports'])) {
                $details['airports'][] = $leg['destination'];
            }

            if ($index > 0) {
                $startTime = strtotime($legData['departure']);
                $endTime = strtotime($details['legs'][$index - 1]['arrival']);
                $diff = ($startTime - $endTime) / 60;
                $details['legs'][$index - 1]['layover'] = $diff;
            }

            $details['legs'][$index] = $leg;
        }
        return $details;
    }

    public function verifyCurrencyConversion($results)
    {
        foreach ($results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['passengers'] as &$row) {
            $row['baseFare'] = app('currencyService')->convert($row['baseFare']);
            $row['taxes'] = app('currencyService')->convert($row['taxes']);
            $row['totalFare'] = app('currencyService')->convert($row['totalFare']);
        }

        foreach ($results['data']['cartResult']['products']['flight']['price'] as &$row) {
            $row = app('currencyService')->convert($row);
        }

        $results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['total'] = app('currencyService')->convert($results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['total']);
        $results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase'] = app('currencyService')->convert($results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase']);
        $results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalTaxes'] = app('currencyService')->convert($results['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalTaxes']);

        return $results;
    }

    public function book($params, $bookingID)
    {
        list($request, $data) = $this->flightsRepo->book($params);

        $history = new BookingHistory;

        $history->action = 'flight';
        $history->booking_id = $bookingID;
        $history->request = $request;
        $history->response = $data;

        $history->save();

        $respData = json_decode($data, true);

        return isset($respData['data']) ? $respData['data']['cartResult']['bookingInfo']['flight'] : $respData;
    }

    public function getBookingResponse($data)
    {
        $response = [
            "bookingNumber" => isset($data['bookingResult']) ? $data['bookingResult']['confirmationNumber'] : 'PENDING',
            "status" => isset($data['bookingResult']) ? strtolower($data['bookingResult']['bookingStatus']) : 'pending',
        ];
        $flight = $data['verifyResult']['products']['flight'];
        $flightId='';

        foreach ($flight['slices'] as $key => $slice) {
            $legs = [];
            $duration = 0;
            $destination = '';
            $departureDate = $slice['segments'][0]['legs'][0]['departure'];
            foreach ($slice['segments'] as $index => $leg) {
                $layover = 0;
                $destination = $leg['destination'];

                if (isset($slice['segments'][$index + 1])) {
                    $startTime = strtotime($leg['legs'][0]['arrival']);
                    $endTime = strtotime($slice['segments'][$index + 1]['legs'][0]['departure']);
                    $layover = ($endTime - $startTime) / 60;
                }

                $legs[] = [
                    "carrierCode" => $leg['flight']['carrier'],
                    "flightNumber" => $leg['flight']['number'],
                    "carrier" => $data['extras']['carriers'][$leg['flight']['carrier']]['name'],
                    "operatedBy" => isset($leg['legs'][0]['operationalDisclosure']) ? $leg['legs'][0]['operationalDisclosure']['disclosureText'] : $data['extras']['carriers'][$leg['flight']['carrier']]['name'],
                    "class" => $leg['bookingInfos']['cabin']??'Economy Class',
                    "departureCode" => $leg['origin'],
                    "departureCity" => $data['extras']['airports'][$leg['origin']]['city'],
                    "departureName" => $data['extras']['airports'][$leg['origin']]['name'],
                    "departureDatetime" => $leg['legs'][0]['departure'],
                    "destinationCode" => $leg['destination'],
                    "destinationCity" => $data['extras']['airports'][$destination]['city'],
                    "destinationName" => $data['extras']['airports'][$destination]['name'],
                    "arrivalDatetime" => $leg['legs'][0]['arrival'],
                    "layoverTime" => $layover,
                ];
                $arrivalTime = $leg['legs'][0]['departure'];
                $arriavalDate = $leg['legs'][0]['arrival'];
                $duration += $leg['legs'][0]['duration'];

                $flightId = $flightId.$leg['flight']['carrier'].$leg['flight']['number'];
            }

            $itinerary = [
                "flightTime" => $duration,
                "flightNumber" => $legs[0]['flightNumber'],
                "originCode" => $legs[0]['departureCode'],
                "originCity" => $legs[0]['departureCity'],
                "originAirport" => $legs[0]['departureName'],
                "departureDateTime" => $legs[0]['departureDatetime'],
                "carrierCode" => strtolower($legs[0]['carrierCode']),
                'carrier' => $legs[0]['carrier'],
                'operatedBy' => $legs[0]['operatedBy'],
                'class' => $legs[0]['class'],
                'segments' => $legs,
            ];

            $lastLeg = end($legs);

            $itinerary['destinationCode'] = $lastLeg['destinationCode'];
            $itinerary['destinationCity'] = $lastLeg['destinationCity'];
            $itinerary['destinationAirport'] = $lastLeg['destinationName'];
            $itinerary['arrivalDateTime'] = $lastLeg['arrivalDatetime'];

            $response['itineraries'][] = $itinerary;

            $flightId = $flightId.$key;
        }
        $response['flightId'] = $flightId;
        $response['blockId'] = $flight['rowId']??'';
        $response['total'] = (float) $flight['rateInfo']['pricingInfo']['total'];
        $response['taxes'] = $flight['rateInfo']['pricingInfo']['totalTaxes'];
        $response['subTotal'] = (float) $flight['rateInfo']['pricingInfo']['totalBase'];
        $response['markupCommission'] = isset($flight['rateInfo']['pricingInfo']['markupCommission']) ? $flight['rateInfo']['pricingInfo']['markupCommission'] : 0;

        return $response;
    }

    public function logBooking($data, $bookingID)
    {
        $response = $this->getBookingResponse($data);

        $flightBooking = new FlightBooking;

        $flightBooking->flight_booking_number = $response['bookingNumber'];
        $flightBooking->booking_id = $bookingID;
        $flightBooking->booking_data = json_encode($response);
        $flightBooking->booking_status = 1;
        $flightBooking->active = 1;

        $flightBooking->save();

        return $response;
    }

    public function mergeResults($flights, $refundableFlights)
    {
        $response = $flights ?? $refundableFlights;

        if (!is_null($flights)) {
            $flightData = &$response['data']['flightResults'];
            $refundableResults = $refundableFlights['data']['flightResults'];
            $refundFlight = $refundableResults['rows'][0];
            $refundFlight['refundable'] = true;
            array_unshift($flightData['rows'], $refundFlight);

            foreach ($refundableResults['extras']['slices'] as $key => $itinerary) {
                if(!array_key_exists($key, $flightData['extras']['slices'])) {
                    $flightData['extras']['slices'][$key] = $itinerary;
                }
            }

            foreach ($refundableResults['extras']['airports'] as $key => $airport) {
                if(!array_key_exists($key, $flightData['extras']['airports'])) {
                    $flightData['extras']['airports'][$key] = $airport;
                }
            }

            foreach ($refundableResults['extras']['carriers'] as $key => $carrier) {
                if(!array_key_exists($key, $flightData['extras']['carriers'])) {
                    $flightData['extras']['carriers'][$key] = $carrier;
                }
            }
        }

        return $response;
    }

    public function getSelectedResult($params)
    {
        $data = $this->flightsRepo->getSelectedResult($params);

        return $data;
    }
}
