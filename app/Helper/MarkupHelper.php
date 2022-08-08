<?php
namespace App\Helper;

use Illuminate\Support\Facades\Cache;

class MarkupHelper
{
	private $id;

	function __construct($id)
	{
		$this->id = $id;
	}

    public function applyFlightsMarkup($markup, $response, $passengers)
    {
    	Cache::put('ft-markup-' . $this->id, $markup, 1800);

        if (!empty($response['error'])) {
            return $response;
        }
        $slices = $response['data']['flightResults']['extras']['slices'];
        foreach ($response['data']['flightResults']['rows'] as &$row) {
        	$applied = false;
        	$sliceOut = $slices[$row['itineraries'][0]];
        	$carrier = $sliceOut['segments'][0]['flight']['carrier']??[];

            if (!empty($markup['airlines'])) {


	            foreach ($markup['airlines'] as $markupRule) {
	                if (in_array($carrier, $markupRule['airlineCode'])) {
                        $markupAmount = 0;
	                    // apply airline markup
	                    if ($markupRule['markup']['type'] == '+') {
                            $markupAmount = floatval($markupRule['markup']['value']) / $passengers;
	                    } else if ($markupRule['markup']['type'] == '%') {
		            		// add percent amount
                            $markupAmount = floatval($row['priceInfo']['cheapest']['saleFareTotal']['amount']) * (floatval($markup['default']['markup']['value']) / 100);
		            	}
	            		$row['priceInfo']['cheapest']['saleFareTotal']['amount'] += $markupAmount;
	            		$row['priceInfo']['cheapest']['saleTotal']['amount'] += $markupAmount;
	            		$applied = true;
	                	break;
	                }
	            }
            }

            if (!$applied && isset($markup['default'])) {
                $markupRule = $markup['default'];
                $markupAmount = 0;
            	// fallback to default
            	if ($markupRule['markup']['type'] == '+') {
            		// add dollar amount
            		$markupAmount = floatval($markupRule['markup']['value']) / $passengers;
            	} else if ($markup['default']['markup']['type'] == '%') {
            		// add percent amount
            		$markupAmount = floatval($row['priceInfo']['cheapest']['saleFareTotal']['amount']) * (floatval($markupRule['markup']['value']) / 100);
            	}
        		$row['priceInfo']['cheapest']['saleFareTotal']['amount'] += $markupAmount;
        		$row['priceInfo']['cheapest']['saleTotal']['amount'] += $markupAmount;
	            $applied = true;
            }

        }
        return $response;
    }

    public function applyFlightsMarkupVerify($response)
    {
    	$markup = Cache::get('ft-markup-' . $this->id);

    	$slices = $response['data']['cartResult']['products']['flight']['slices'];
    	$sliceOut = $slices[0];
    	$carrier = $sliceOut['segments'][0]['flight']['carrier'];

        $applied = false;

        if (!empty($markup['airlines'])) {
            foreach ($markup['airlines'] as $markupRule) {
                if (in_array($carrier, $markupRule['airlineCode'])) {
                    $markupAmount = 0;
                    // apply airline markup
                    if ($markupRule['markup']['type'] == '+') {
                    	// add dollar amount
	            		$markupAmount = floatval($markup['default']['markup']['value']);
                    } else if ($markupRule['markup']['type'] == '%') {
	            		// add percent amount
	            		$markupAmount = floatval($response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase']) * (floatval($markupRule['markup']['value']) / 100);
	            	}
            		$response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase'] += $markupAmount;
            		$response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['total'] += $markupAmount;
                    $response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['markupCommission'] = $markupAmount;
            		$applied = true;
                	break;
                }
            }
        }

        if (!$applied && isset($markup['default'])){
            $markupRule = $markup['default'];
            $markupAmount = 0;
        	// fallback to default
        	if ($markup['default']['markup']['type'] == '+') {
        		// add dollar amount
        		$markupAmount = floatval($markupRule['markup']['value']);
        	} else if ($markup['default']['markup']['type'] == '%') {
        		// add percent amount
        		$markupAmount = floatval($response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase']) * (floatval($markupRule['markup']['value']) / 100);
        		$response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['totalBase'] += $markupAmount;
        		$response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['total'] += $markupAmount;
                $response['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['markupCommission'] = $markupAmount;
	            $applied = true;
        	}
        }

        return $response;
    }

    public function applyHotelsMarkup($markup, $response)
    {
        if (!empty($response['error'])) {
            return $response;
        }

        foreach ($response['data']['hotelResults']['rows'] as &$row) {
        // dd($row['rooms']);

            $applied = false;
            $vendor = $row['vendor'];
            $hotelId = $row['UnicaID'];

            if (!empty($markup['hotels'])) {
                foreach ($markup['hotels'] as $markupRule) {
                    if (in_array($hotelId, $markupRule['hotelIds'])) {
                        $markupAmount = 0;
                        // apply hotel markup
                        if ($markupRule['markup']['type'] == '+') {
                            // add dollar amount
                            $markupAmount = floatval($markupRule['markup']['value']);
                        } else if ($markupRule['markup']['type'] == '%') {
                            // add percent amount cheaty exponential growth markup rate
                            $markupAmount = floatval($row['rooms']['rateInfo']['avgBaseRate']) / ((100 - floatval($markupRule['markup']['value'])) / 100) - floatval($row['rooms']['rateInfo']['avgBaseRate']);
                        }
                        $row['rooms']['rateInfo']['avgRate'] += $markupAmount;
                        $row['rooms']['rateInfo']['avgBaseRate'] += $markupAmount;
                        $applied = true;
                        break;
                    }
                }
            }

            if(!$applied && !empty($markup['vendors'])) {
                foreach ($markup['vendors'] as $markupRule) {
                    if (($vendor === 'P' && $markupRule['name'] ==='PPN') || ($vendor === 'TT' && $markupRule['name'] === 'TTS') || ($vendor === 'TN' && $markupRule['name'] ===  substr($row['tbiHotelCode'], -3))) {
                        $markupAmount = 0;
                        // apply hotel markup
                        if ($markupRule['markup']['type'] == '+') {
                            // add dollar amount
                            $markupAmount = floatval($markupRule['markup']['value']);
                        } else if ($markupRule['markup']['type'] == '%') {
                            // add percent amount
                            $markupAmount = floatval($row['rooms']['rateInfo']['avgRate']) / ((100 - floatval($markupRule['markup']['value'])) / 100) - floatval($row['rooms']['rateInfo']['avgRate']);
                        }
                        $row['rooms']['rateInfo']['avgRate'] += $markupAmount;
                        $row['rooms']['rateInfo']['avgBaseRate'] += $markupAmount;
                        $applied = true;
                        break;
                    }
                }
            }

            if (!$applied && isset($markup['default'])) {
                $markupRule = $markup['default'];
                $markupAmount = 0;
                // fallback to default
                if ($markup['default']['markup']['type'] == '+') {
                    // add dollar amount
                    $markupAmount = floatval($markupRule['markup']['value']);
                } else if ($markup['default']['markup']['type'] == '%') {
                    // add percent amount
                    $markupAmount = floatval($row['rooms']['rateInfo']['avgRate']) / ((100 - floatval($markupRule['markup']['value'])) / 100) - floatval($row['rooms']['rateInfo']['avgRate']);
                }
                $row['rooms']['rateInfo']['avgRate'] += $markupAmount;
                $row['rooms']['rateInfo']['avgBaseRate'] += $markupAmount;
            }

        }
        return $response;
    }

    public function applyHotelsMarkupVerify($response)
    {
        $markup = Cache::get('htl-markup-' . $this->id);

        $row = $response['data']['cartResult']['products']['hotel'];

        $vendor = isset($row['vendor']) && $row['vendor'] === 'P' ? 'PPN' : '';
        if ($vendor === '') {
            if (preg_match("/_[A-Z]{3}$/", $row['hotelDetails']['vendorId'])) {
                $vendor = strtoupper(substr($row['hotelDetails']['vendorId'], -3));
            } else {
                $vendor = 'TTS';
            }
        }

        $applied = false;
        $hotelId = $row['hotelDetails']['UnicaID'];

        if (!empty($markup['hotels'])) {
            foreach ($markup['hotels'] as $markupRule) {
                if (in_array($hotelId, $markupRule['hotelIds'])) {
                    $markupAmount = 0;
                    // apply hotel markup
                    if ($markupRule['markup']['type'] == '+') {
                        $markupAmount = floatval($markupRule['markup']['value']);
                    } else if ($markupRule['markup']['type'] == '%') {
                        // add percent amount
                        $baseAmount = floatval($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase']);
                        $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
                    }
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'] += $markupAmount;
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'] += $markupAmount;
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['markupCommission'] = $markupAmount;
                    $applied = true;
                    foreach ($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['cancellationPolicy'] as $key => &$clInfo) {
                        foreach ($clInfo as &$policy) {
                            if(floatval($policy['display_amount']) != 25) {
                                $baseAmount = floatval($policy['display_amount']);
                                $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                                $policy['display_amount'] = $markupAmount;
                                $policy['display_total_charges'] = $markupAmount;
                            }
                        }
                    }
                }
            }
        }

        if(!$applied && !empty($markup['vendors'])) {
            foreach ($markup['vendors'] as $markupRule) {
                if ($vendor === strtoupper($markupRule['name'])) {
                    $markupAmount = 0;
                    // apply hotel markup
                    if ($markupRule['markup']['type'] == '+') {
                        // add dollar amount
                        $markupAmount = floatval($markupRule['markup']['value']);
                    } else if ($markupRule['markup']['type'] == '%') {
                        // add percent amount
                        $baseAmount = floatval($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase']);
                        $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
                    }
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'] += $markupAmount;
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'] += $markupAmount;
                    $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['markupCommission'] = $markupAmount;
                    $applied = true;
                    foreach ($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['cancellationPolicy'] as $key => &$clInfo) {
                        foreach ($clInfo as &$policy) {
                            if(floatval($policy['display_amount']) != 25) {
                                $baseAmount = floatval($policy['display_amount']);
                                $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                                $policy['display_amount'] = $markupAmount;
                                $policy['display_total_charges'] = $markupAmount;
                            }
                        }
                    }
                }
            }
        }

        if (!$applied && isset($markup['default'])) {
            $markupRule = $markup['default'];
            $markupAmount = 0;
            // fallback to default
            if ($markupRule['markup']['type'] == '+') {
                // add dollar amount
                $markupAmount = floatval($markupRule['markup']['value']);
            } else if ($markupRule['markup']['type'] == '%') {
                // add percent amount
                $baseAmount = floatval($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase']);
                $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
            }
            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'] += $markupAmount;
            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'] += $markupAmount;
            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['markupCommission'] = $markupAmount;
            $applied = true;
            foreach ($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['cancellationPolicy'] as $key => &$clInfo) {
                foreach ($clInfo as &$policy) {
                    if(floatval($policy['display_amount']) != 25) {
                        $baseAmount = floatval($policy['display_amount']);
                        $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                        $policy['display_amount'] = $markupAmount;
                        $policy['display_total_charges'] = $markupAmount;
                    }
                }
            }
        }

        if(!$applied){

            $baseAmount = floatval($response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase']);
            $markupAmount = $baseAmount / ((100 - 10) / 100) - $baseAmount;

            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['totalBase'] += $markupAmount;
            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'] += $markupAmount;
            $response['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['markupCommission'] = $markupAmount;

        }

        return $response;
    }

    public function applyHotelDetailsMarkup($markup, $response)
    {
        $vendor = isset($response['data']['hotelDetails']['vendor']) && $response['data']['hotelDetails']['vendor'] === 'P' ? 'PPN' : '';
        if ($vendor === '') {
            if (preg_match("/_[A-Z]{3}$/", $response['data']['hotelDetails']['vendorId'])) {
                $vendor = strtoupper(substr($response['data']['hotelDetails']['vendorId'], -3));
            } else {
                $vendor = 'TTS';
            }
        }

        $hotelId = $response['data']['hotelDetails']['UnicaID'];

        $roomOptions = !empty($response['data']['normalizedRoomResults']) ? $response['data']['normalizedRoomResults'] : $response['data']['roomResults'];

        if(!empty($roomOptions)) {
            foreach ($roomOptions['rows'] as &$row) {
                $applied = false;
                if (!empty($markup['hotels'])) {
                    foreach ($markup['hotels'] as $markupRule) {
                        if (in_array($hotelId, $markupRule['hotelIds'])) {
                            // apply hotel markup
                            $markupAmount = 0;
                            if ($markupRule['markup']['type'] == '+') {
                                // add dollar amount
                                $markupAmount = floatval($markupRule['markup']['value']);
                            } else if ($markupRule['markup']['type'] == '%') {
                                // add percent amount
                                $baseAmount = floatval($row['rateinfo']['pricingInfo']['totalBase']);
                                $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
                            }
                            $row['rateinfo']['pricingInfo']['totalBase'] += $markupAmount;
                            $row['rateinfo']['pricingInfo']['total'] += $markupAmount;
                            $applied = true;
                            foreach ($row['rateinfo']['pricingInfo']['cancellationPolicy'] as $key => &$clInfo) {
                                foreach ($clInfo as &$policy) {
                                    if(floatval($policy['display_amount']) != 25) {
                                        $baseAmount = floatval($policy['display_amount']);
                                        $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                                        $policy['display_amount'] = $markupAmount;
                                        $policy['display_total_charges'] = $markupAmount;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }

                if(!$applied && !empty($markup['vendors'])) {
                    foreach ($markup['vendors'] as $markupRule) {
                        if ($vendor === strtoupper($markupRule['name'])) {
                            $markupAmount = 0;
                            // apply hotel markup
                            if ($markupRule['markup']['type'] == '+') {
                                // add dollar amount
                                $markupAmount = floatval($markupRule['markup']['value']);
                            } else if ($markupRule['markup']['type'] == '%') {
                                $baseAmount = floatval($row['rateinfo']['pricingInfo']['totalBase']);
                                $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
                            }
                            $row['rateinfo']['pricingInfo']['totalBase'] += $markupAmount;
                            $row['rateinfo']['pricingInfo']['total'] += $markupAmount;
                            $applied = true;
                            foreach ($row['rateinfo']['pricingInfo']['cancellationPolicy'] as $key => &$clInfo) {
                                foreach ($clInfo as &$policy) {
                                    if(floatval($policy['display_amount']) != 25) {
                                        $baseAmount = floatval($policy['display_amount']);
                                        $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                                        $policy['display_amount'] = $markupAmount;
                                        $policy['display_total_charges'] = $markupAmount;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }

                if (!$applied && isset($markup['default'])) {
                    $markupRule = $markup['default'];
                    $markupAmount = 0;
                    // fallback to default
                    if ($markupRule['markup']['type'] == '+') {
                        // add dollar amount
                        $markupAmount = floatval($markupRule['markup']['value']);
                    } else if ($markupRule['markup']['type'] == '%') {
                        // add percent amount
                        $baseAmount = floatval($row['rateinfo']['pricingInfo']['totalBase']);
                        $markupAmount = $baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100) - $baseAmount;
                    }
                    $row['rateinfo']['pricingInfo']['totalBase'] += $markupAmount;
                    $row['rateinfo']['pricingInfo']['total'] += $markupAmount;
                    foreach ($row['rateinfo']['pricingInfo']['cancellationPolicy'] as $key => &$clInfo) {
                        foreach ($clInfo as &$policy) {
                            if(floatval($policy['display_amount']) != 25) {
                                $baseAmount = floatval($policy['display_amount']);
                                $markupAmount = round(($baseAmount / ((100 - floatval($markupRule['markup']['value'])) / 100)), 2);
                                $policy['display_amount'] = $markupAmount;
                                $policy['display_total_charges'] = $markupAmount;
                            }
                        }
                    }
                }
            }

            $response['data']['roomResults'] = $roomOptions;
        }

        return $response;
    }
}
