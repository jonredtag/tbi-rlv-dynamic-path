@php
    $pageTitle = 'Confirmation';
    $hotel = $emailData['hotel']??null;
    $transfer =  $emailData['transfer']??null;
    $activity = $emailData['activity']??null; 
    $insurance =  $emailData['insurance']??null;
    $adults=0;
    $children=0;
    $bookingStatus = $emailData['isConfirmed']?'final':'fail';
    $bookingDate=date("Y|m|d", strtotime($emailData['trip']['departureDate']));
    $returnDate=date("Y|m|d", strtotime($emailData['trip']['returnDate']));
    $bookingOrigin=($emailData['trip']['originCode'])?$emailData['trip']['originCode']:'';
    foreach($searchParameters['occupancy'] as $passenger){
        $adults=$adults+$passenger['adults'];
        $children=$children+$passenger['children'];
    }
    $numberofCard=count($emailData['payment']['paymentCards']);
    $siteSection = $searchParameters['selectedProducts']=='FH'?'dynamic':'hotels';
    $isActivityStandalone = isset($activity) && !isset($hotel);
@endphp

@extends('template')

@section('content')
@php
    $dateFormat = 'D. F j, Y';
    $timeFormat = 'h:i A';
    // echo "<pre>";
    // print_r($emailData);
    // die();
@endphp
<div class="container bg-white mt-4 p-3 p-md-5">
    <div class="row no-gutters border-bottom justify-content-between">
        <small>@if(config('site.site') !== 'copolo')@lang('common.corporate')@endif</small>
        <small class="blue-text">{{ $emailData['bookingDateTime']->format($dateFormat) }} at {{ $emailData['bookingDateTime']->format($timeFormat) }}</small>
    </div>
    <div class="row no-gutters justify-content-end text-right mt-1">
        <p>@lang('confirmation.confirmationNumber'):
            <br><span class="green-text font-weight-bold">{{ $emailData['bookingNumber'] }}</span>
            {{-- <br><span class="orange-text-lt font-weight-bold">processing</span> --}}
        </p>
    </div>
    <div class="row gutter-10 justify-content-center">
        <h1 class="h4 text-center font-weight-normal">@lang('confirmation.thankYouHeader', ["site" => config('site.name')])<br>
            @if($emailData['isConfirmed'])
                @if(!$emailData['isStandalone']) 
                    @lang("confirmation.vacationConfirmed")
                @else
                    @if(isset($activity))
                        @lang('confirmation.activityConfirmed')
                    @else 
                        @lang('confirmation.hotelConfirmed')
                    @endif 
                 @endif <span class="green-text">@lang('common.confirmed')</span>.<br>
            @else
                @if($emailData['isStandalone'] && isset($activity))
                        @lang('confirmation.activityPending').
                @else
                    @lang('confirmation.pending').
                @endif<br>
            @endif
            @if($insurance)
                @if($emailData['hasInsurance'])
                    @lang('confirmation.insuranceConfirmed') @if($emailData['insurance']['bookingNumber'] !== 'Pending')<span class="green-text">@lang('common.confirmed')</span>@else<span class="orange-text-lt">@lang('common.processing')</span>@endif.
                @else
                    @lang('confirmation.insuranceConfirmed') <span class="red-text">@lang('common.declined')</span>.
                @endif
            @endif
            {{--
            <br>
            @lang("confirmation.vacationConfirmed") <span class="orange-text-lt">@lang('common.reserved')</span>
            --}}
        </h1>
    </div>
    {{-- <p class="my-3 p-3 bg-grey d-flex align-items-center">
        <img src="http://secure-stg.redtag.ca/email/temp-icon.png" width="" border="0" alt="" class="pr-3">
        <span>
			@lang('confirmation.rateAvailabilityMessage')
		</span>
    </p> --}}

    @if($emailData['refundablePath'])
        <div class="border-top-thick py-3">
            <h5 class="orange-text-lt">@lang('confirmation.refundableBalance')</h5>
            <p class="mb-0">@lang('confirmation.refundableDeposit') @lang('confirmation.refundableDepositAmount'){{number_format($emailData['payment']['total'] - $emailData['payment']['deposit'], 2)}} @lang('confirmation.refundableDepositDate') {{$emailData['payment']['balanceDueDate']}}.</p>
        </div>
        <div class="border-top-thick py-3">
            <div class="row ">
                <div class="col-2 col-xl-1">
                    <img class="w-100" src="https://redtag-ca.s3.amazonaws.com/img/logos/logo-bwc.svg">
                </div>
                <div class="col-10 col-md-8 col-lg-10 align-self-center  ">
                    <h5 class="bwc-color">@lang('common.bookConfidence')</h5>
                    <p class="">@lang('confirmation.refundableSummary')</p>
                    <p class="mb-0">@lang('confirmation.refundableTerms')</p>
                </div>
            </div>
        </div>
    @endif
    <div class="border-top-thick py-3">
        <h5>@lang('common.importantInformation')</h5>
        @if($isActivityStandalone)
          <p class="m-0">@lang('confirmation.confirmationActivityMessage')</p>
        @elseif(!$emailData['refundablePath'])
            <p class="m-0">@lang('confirmation.confirmationHotelMessage')</p>
            @if(!empty($emailData['flight']))
                <p class="m-0">@lang('confirmation.confirmationFlightMessage')</p>
            @endif
        @endif
        <p class="m-0">@lang('confirmation.confirmationPassport')</p>
    </div>
    <div class="border-top-thick d-flex justify-content-between py-3">
        <h5 class="mb-0">@lang('confirmation.bookingSummary')</h5>
    </div>
    @if(!empty($hotel))
        <div class="row justify-content-between mb-2">
            <div class="col-12 col-md-6">
                @if(!$emailData['isStandalone'])
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.departFrom'):</span>
                    <span class="text-right"><strong class="text-right">{{ $emailData['trip']['originCity'] }} ({{$emailData['trip']['originCode']}})</strong></span>
                </p>
                @endif
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.destination'):</span>
                    <span class="text-right"><strong class="text-right">{{ $emailData['trip']['destinationCity'] }} ({{$emailData['trip']['destinationCode']}})</strong></span>
                </p>
                {{-- <p class="mb-0 py-2">
                    <span>Supplier:</span>
                    <span class="float-right"><strong>(((Sunwing)))</strong></span>
                </p> --}}
            </div>
            <div class="col-12 col-md-6">
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.departureDate'):</span>
                    <span class="text-right"><strong>{{ $emailData['departDate']->format($dateFormat) }}</strong></span>
                </p>
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.returnDate'):</span>
                    <span class="text-right"><strong>{{ $emailData['returnDate']->format($dateFormat) }}</strong></span>
                </p>
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('common.duration'):</span>
                    <span class="text-right"><strong>{{ $emailData['trip']['duration'] }} @lang('common.nights')</strong></span>
                </p>
            </div>
        </div>
    @endif
    @if(isset($emailData['hotel']))
        <div class="border-top-thick py-3">
            <h5 class="mb-0">@lang('common.hotelDetails')</h5>
            <p class="mb-0">
                <span>@lang('confirmation.confirmationNumber'):</span>
                <span class="text-right"><strong>{{ $emailData['hotel']['bookingNumber'] }}</strong></span>
            </p>
        </div>
        <div class="row justify-content-between">
            <div class="col-12 col-md-6">
                <p class="mb-0">
                    <span><strong>{{ $emailData['hotel']['name'] }}</strong></span>
                </p>
                <div class="border-bottom d-flex justify-content-between mb-0 py-2">
                    @stars($emailData['hotel']['rating'])
                </div>
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.roomType'):</span>
                    <span class="text-right"><strong>{{ $emailData['hotel']['roomType'] }}</strong></span>
                </p>
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.numberOfRooms'):</span>
                    <span class="text-right"><strong>{{ $emailData['hotel']['numOfRooms'] }}</strong></span>
                </p>
                @if($emailData['hotel']['bedType'])
                    <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                        <span>Bed Type:</span>
                        <span class="text-right"><strong>{{ $emailData['hotel']['bedType']['title'] }}</strong></span>
                    </p>
                @endif
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.checkInDate'):</span>
                    <span class="text-right"><strong>{{ $emailData['hotel']['checkIn'] }}</strong></span>
                </p>
                <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                    <span>@lang('common.checkOutDate'):</span>
                    <span class="text-right"><strong>{{ $emailData['hotel']['checkOut'] }}</strong></span>
                </p>
            </div>
            <div class="col-12 col-md-6">
                <img src="{{ $emailData['hotel']['image'] }}" class="img-fluid mb-3" border="0" alt="hotel image">
            </div>

        </div>
    @endif
    @if(!$emailData['isStandalone'])
        {{--===========================================================================================================================================================--}}
        {{--===========================================================================================================================================================--}}
        {{--===========================================================================================================================================================--}}
        <div class="border-top-thick py-3">
            <h5 class="mb-0">@lang('common.flightDetails')</h5>
            <p class="mb-0">
                <span>@lang('confirmation.confirmationNumber'):</span>
                <span class="text-right"><strong>{{ $emailData['flight']['bookingNumber'] }}</strong></span>
            </p>
        </div>
        <div class="row justify-content-between flight-product-component border-0 shadow-none">
            <div class="col-12 col-md-6">
                <h6><span class="font-weight-bold">@lang('common.departure')</span> - {{ $emailData['flight']['itineraries'][0]['segments'][0]['depDate'] }}</h6>
                @foreach($emailData['flight']['itineraries'][0]['segments'] as $segment)
                    <div class="flight-small-text mb-3">
                        <span class="flight-dot-divider">{{ $segment['carrier'] }}</span>@lang('common.flight') #{{ $segment['flightNumber'] }}
                    </div>
                    <div class="ml-1 flight-time-airport-section-container position-relative">
                        <div class="flight-time-airport-section position-relative px-3">
                            <span class="flight-dot-divider">{{ $segment['depTime'] }}</span>{{ $segment['departureName'] }} ({{ $segment['departureCode'] }})
                        </div>
                        <div class="flight-travel-time flight-small-text pt-3 pb-3"></div>
                    </div>
                    <div class="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                        <span class="flight-dot-divider">{{ $segment['arrTime'] }}</span>{{ $segment['destinationName'] }} ({{ $segment['destinationCode'] }})
                    </div>
                    <div class="mb-4 class flight-small-text">
                        <span class="flight-dot-divider">{{ $segment['class'] }}</span>@lang('common.operatedBy'): {{ $segment['operatedBy'] }}
                    </div>
                @endforeach
            </div>
            <div class="col-12 col-md-6">
                <h6><span class="font-weight-bold">@lang('common.return')</span> - {{ $emailData['flight']['itineraries'][1]['segments'][0]['depDate'] }}</h6>
                @foreach($emailData['flight']['itineraries'][1]['segments'] as $segment)
                    <div class="flight-small-text mb-3">
                        <span class="flight-dot-divider">{{ $segment['carrier'] }}</span>@lang('common.flight') #{{ $segment['flightNumber'] }}
                    </div>
                    <div class="ml-1 flight-time-airport-section-container position-relative">
                        <div class="flight-time-airport-section position-relative px-3">
                            <span class="flight-dot-divider">{{ $segment['depTime'] }}</span>{{ $segment['departureName'] }} ({{ $segment['departureCode'] }})
                        </div>
                        <div class="flight-travel-time flight-small-text pt-3 pb-3"></div>
                    </div>
                    <div class="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                        <span class="flight-dot-divider">{{ $segment['arrTime'] }}</span>{{ $segment['destinationName'] }} ({{ $segment['destinationCode'] }})
                    </div>
                    <div class="mb-4 class flight-small-text">
                        <span class="flight-dot-divider">{{ $segment['class'] }}</span>@lang('common.operatedBy'): {{ $segment['operatedBy'] }}
                    </div>
                @endforeach
            </div>
        </div>
        <div id="sherpa-widget"></div>
        @if($emailData['hasFlightOptions'])
            <div class="border-top-thick py-3">
                <h5 class="mb-0">Flight Options</h5>
                <div class="flight-product-component border-0 shadow-none">
                    <div class="flight-small-text mt-2">
                        <span class="flight-dot-divider">Delta</span>Flight #8840
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <div class="row no-gutters py-2">
                    <div class="col-4 col-md-3">
                        <strong>Passengers(s):</strong>
                    </div>
                    <div class="col-3">
                        <strong>Frequent Flyer:</strong>
                    </div>
                    <div class="col-2">
                        <strong>Seat:</strong>
                    </div>
                    <div class="col-3">
                        <strong>Meal Preferrence:</strong>
                    </div>
                </div>
                <div class="row no-gutters py-2 border-bottom">
                    <div class="col-4 col-md-3">
                        Mr. Yogi Bear
                    </div>
                    <div class="col-3">
                        33A
                    </div>
                    <div class="col-2">
                        33B
                    </div>
                    <div class="col-3">
                        Meal type name
                    </div>
                </div>
                <div class="row no-gutters py-2">
                    <div class="col-4 col-md-3">
                        Mr. Bobo Bear
                    </div>
                    <div class="col-3">
                        33A
                    </div>
                    <div class="col-2">
                        33B
                    </div>
                    <div class="col-3">
                        Meal type name
                    </div>
                </div>
            </div>
        @endif

        @if($emailData['hasBaggageInfo'])
            <div class="border-top-thick py-3">
                <h5 class="mb-0">Baggage Information</h5>
            </div>
            <div class="row no-gutters">
                <p>Baggage info text</p>
            </div>
        @endif

        {{-- <div class="border-top-thick py-3">
            <div class="row gutter-10">
                <div class="col-2">
                    <img src="https://s3.amazonaws.com/redtag-ca/img/email/price-drop.png" width="100%" border="0" alt="">
                </div>
                <div class="col">
                    <p>price assuarance text</p>
                </div>
            </div>
        </div> --}}
        @if(isset($emailData['car']))
            <div class="border-top-thick py-3">
                <h5 class="mb-0">Rental Car Details:</h5>
                <p class="mb-0">
                    <span>@lang('confirmation.confirmationNumber'):</span>
                    <span class="text-right"><strong>{{ $emailData['car']['bookingNumber'] }}</strong></span>
                </p>
                <p class="mb-0">
                    <span>@lang('confirmation.referenceNumber'):</span>
                    <span class="text-right">{{ $emailData['car']['referenceNumber'] }}</span>
                </p>
            </div>
            <div class="row justify-content-between">
                <div class="col-12 col-md-6">
                    <p class="mb-2">
                        <span><strong>{{$emailData['car']['name']}} or similar</strong></span>
                        <span class="float-right"><img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/{{strtolower($emailData['car']['vendor'])}}.jpg" /></span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Transmission:</span>
                        <span class="float-right">
                            {{$emailData['car']['transmission']}}
                        </span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Air Conditioning:</span>
                        <span class="float-right">
                            A/C
                        </span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Passengers:</span>
                        <span class="float-right">
                            x{{$emailData['car']['passengers']}}
                        </span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Doors:</span>
                        <span class="float-right">
                            x{{$emailData['car']['doors']}}
                        </span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Pickup:</span>
                        <span class="float-right">
                            {{$emailData['car']['pickup']['name']}} - {{$emailData['car']['pickupDateTime']}}
                        </span>
                    </p>
                    <p class="border-bottom mb-0 py-2">
                        <span>Drop Off:</span>
                        <span class="float-right">
                            {{$emailData['car']['dropoff']['name']}} - {{$emailData['car']['dropoffDateTime']}}
                        </span>
                    </p>
                </div>
                <div class="col-12 col-md-6">
                    <img src="{{$emailData['car']['image']}}" class="img-fluid mb-3" border="0" alt="car image">
                </div>
            </div>
        @endif
        @if($insurance)
            <div class="border-top-thick py-3">
                <h5 class="mb-0">@lang('common.travelInsuranceDetails')</h5>
            </div>
            @if ($emailData['hasInsurance'])
                <div class="row no-gutters">
                    <p class="mb-2"><strong>
                        @lang('common.manulifePolicy')#
                        @if($emailData['insurance']['bookingNumber'] === 'Pending')<span class="orange-text-lt">@endif
                        {{ $emailData['insurance']['bookingNumber'] }}
                        @if($emailData['insurance']['bookingNumber'] === 'Pending')</span>@endif
                    </strong></p>
                </div>
                <div class="row justify-content-between mb-2">
                    @foreach(array_keys($emailData['insurance']['passengers']) as $passengerKey)
                        <div class="col-12 col-md-6">
                            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                                @lang('common.passenger') {{ $passengerKey }}:
                            </p>
                            <p class="mb-0 py-2">
                                <strong>{{ $emailData['insurance']['passengers'][$passengerKey]['plan'] }}</strong>
                            </p>
                        </div>
                    @endforeach
                </div>
                <p class="red-text">
                    @if($emailData['insurance']['bookingNumber'] !== 'Pending')
                        @lang('confirmation.insuranceMessage', ['phone' => config('site.phone'), 'email' => config('site.email')])
                    @else
                        @lang('confirmation.insuranceErrorMessage', ['phone' => config('site.phone'), 'email' => config('site.email')])
                    @endif
                </p>
            @endif

            {{-- <div class="row no-gutters">
                <p class="mb-2"><strong>Manulife Policy# <span class="orange-text-lt">N/A</span></strong></p>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="border-bottom mb-0 py-2">
                        Passenger 1:
                    </p>
                    <p class="mb-0 py-2">
                        <strong>Global Medical - under age 60</strong>
                    </p>
                </div>
                <div class="col-12 col-md-6">
                    <p class="border-bottom mb-0 py-2">
                        Passenger 2:
                    </p>
                    <p class="mb-0 py-2">
                        <strong>Global Medical - under age 60</strong>
                    </p>
                </div>
            </div>
            <p class="red-text">Sorry, Your travel insurance booking is currently pending. Please call us at 1-866-873-3824 to resolve the issue.
            </p>
            <div class="row no-gutters">
                <p class="mb-2"><strong>Manulife Policy# <span class="orange-text-lt">Processing</span></strong></p>
            </div>
            --}}
            @if (!$emailData['hasInsurance'])
                <div class="row no-gutters">
                    <p class="mb-2"><strong>@lang('common.manulifePolicy')# <span class="red-text">@lang('common.declined')</span></strong></p>
                    <p class="red-text">@lang('confirmation.insuranceDeclinedMessage', ['phone' => config('site.phone'), 'email' => config('site.email')])</p>
                </div>
            @endif
        {{--===========================================================================================================================================================--}}
        {{--===========================================================================================================================================================--}}
        {{--===========================================================================================================================================================--}}
        @endif
    @else
    <div id="sherpa-widget"></div>
    @endif
    @if(isset($emailData['choose']))
        <div class="border-top-thick py-3">
            <h5 class="mb-0">Choose Carbon Footprint</h5>
            <p class="mb-0">
                <span>@lang('confirmation.confirmationNumber'):</span>
                <span class="text-right"><strong>{{ $emailData['choose']['choose']['billId'] }}</strong></span>
            </p>
            <p class="mb-0">
                <span>Order Number:</span>
                <span class="text-right">{{ $emailData['choose']['choose']['orderId'] }}</span>
            </p>
        </div>
        <div class="row justify-content-between">
            <div class="col-12 col-md-6">
                <p class="mb-0 py-2">
                    <span>Carbon compensation (CO2e):</span>
                    <span class="float-right">
                        {{$emailData['choose']['item']['kilosCo2']}} kg
                    </span>
                </p>
            </div>
        </div>
    @endif

    @if(isset($transfer))
        <div class="border-top-thick py-3">
            <h5 class="mb-0">Transportation Details</h5>
            <p class="mb-0">
                <span>@lang('confirmation.confirmationNumber'):</span>
                <span class="text-right"><strong>{{$transfer['bookingNumber']}}</strong></span>
            </p>
        </div>
        @if(isset($transfer['tripInfo']))
            @foreach($transfer['tripInfo'] as $tripInfo)
                <div class="row mb-2">
                    <div class="col-12 col-md-6">
                        <h6>From Ariport to Hotel</h6>
                        <div><strong>{{$tripInfo['serviceName']}}</strong></div>
                        <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                            <span>Pick up date:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['arr']['formatTime']}}</strong></span>
                        </p>
                        <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                            <span>Pick up location:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['arr']['from']['description'] }}</strong></span>
                        </p>
                        <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                            <span>Drop off location:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['arr']['to']['description'] }}</strong></span>
                        </p>
                        <h6 class="mt-3">From Hotel to Airport</h6>
                        <div><strong>{{$tripInfo['serviceName']}}</strong></div>
                        <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                            <span>Pick up date:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['dep']['formatTime']}}</strong></span>
                        </p>
                        <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                            <span>Pick up location:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['dep']['from']['description'] }}</strong></span>
                        </p>
                        <p class=" d-flex justify-content-between mb-0 py-2">
                            <span>Drop off location:</span>
                            <span class="text-right"><strong>{{$tripInfo['pickupInformation']['dep']['to']['description'] }}</strong></span>
                        </p>
                    </div>
                    <div class="col-12 col-md-6">
                        <img class="w-100" src="{{$tripInfo['thumbImg']}}" alt="">
                    </div>
                </div>
            @endforeach
        @endif
    @endif

    @if(isset($activity))
        <div class="border-top-thick py-3">
            <h5 class="mb-0">Activity Details</h5>
            <p class="mb-0">
                <span>@lang('confirmation.confirmationNumber'):</span>
                <span class="text-right"><strong>{{$activity['bookingNumber']}}</strong></span>
            </p>
        </div>
        @foreach($activity['tripInfo'] as $tripInfo)
            <div class="row mb-2">
                <div class="col-12 col-md-6">
                    <h6>Supplier:{{$tripInfo['supplier']}}</h6>
                    <div><strong>{{$tripInfo['name']}}</strong></div>
                    <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                        <span>Date:</span>
                        <span class="text-right"><strong>From {{$tripInfo['selectDate']['from']}} to {{$tripInfo['selectDate']['to']}}</strong></span>
                    </p>
                </div>
                @if(!empty($tripInfo['comments']))
                <div class="col-12 col-md-6">
                      <div><strong>Comments</strong></div>
                      <p class="border-bottom d-flex justify-content-between mb-0 py-2">
                        <span class="text-left">{{$tripInfo['comments']['text']}}</span>
                     </p>
                </div>
                @endif
             </div>
           @if(!empty($tripInfo['cancellationPolicies']))
            <div class="row mb-2">
                   <div><strong>Cancellation fees:</strong></div><br>&nbsp;&nbsp;
                    @foreach($tripInfo['cancellationPolicies'] as $pl)
                        @if(is_array($pl) && !empty($pl['dateFrom']))
                            @php
                                  $cancelDate =  new \DateTime($pl['dateFrom']);
                                  $cancelFreeDate=  (new \DateTime($pl['dateFrom']))->modify('-1 minutes');
                            @endphp
                            <p class="green-text font-weight-bold">
                                <span class="time">Until {{$cancelFreeDate->format('Y-m-d')." ".$cancelFreeDate->format('h:i A')  }}  
                                </span><span class="amount">Free</span> 
                            </p><br>&nbsp;&nbsp;
                            <p>
                                <span class="time">&nbsp;From {{$cancelDate->format('Y-m-d')." ".$cancelDate->format('h:i A')}}  </span><span class="amount red-text">${{$pl['amount']}}</span> 
                            </p>
                         @endif   
                    @endforeach
            </div>  
           @endif
        @endforeach
    @endif
    <!-- place widget -->

    <div class="border-top-thick py-3">
        <h5 class="mb-0">@lang('common.passengerDetails')</h5>
    </div>
    <div class="row justify-content-between mb-2">
        @foreach($emailData['passengers'] as $passenger)
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('common.passenger') {{ $loop->index + 1 }}:</span>
                    <span class="text-right"><strong>{{ $passenger['name'] }}</strong></span>
                </p>
                @if($loop->index === 0)
                    <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span>@lang('common.phoneNumber'):</span>
                        <span class="text-right"><strong>{{ $emailData['contact']['phoneNumber'] }}</strong></span>
                    </p>
                @endif
                @if(!empty($passenger['birthDate']))
                    <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span>@lang('common.dateOfBirth'):</span>
                        <span class="text-right"><strong>{{ $passenger['birthDate'] }}</strong></span>
                    </p>
                @endif
                @if($loop->index === 0)
                    <p class="mb-0 py-2 d-flex justify-content-between">
                        <span>@lang('common.emailAddress'):</span>
                        <span class="text-right"><strong>{{ $emailData['contact']['email'] }}</strong></span>
                    </p>
                @endif
            </div>
        @endforeach
    </div>
    <div class="border-top-thick py-3">
        <h5>@lang('confirmation.paymentSummary')</h5>
    </div>
    @if(!$emailData['isStandalone'])
        <div class="row justify-content-between">
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>{{ $emailData['passengerCount'] }} @lang('common.passengers') x ${{ number_format($emailData['payment']['basePer'], 2) }}:</span>
                    <span class="text-right"><strong>${{ number_format($emailData['payment']['subTotal'], 2) }}</strong></span>
                </p>
            </div>
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>{{ $emailData['passengerCount'] }} @lang('common.passengersTaxesFees') x ${{ number_format($emailData['payment']['taxesPer'], 2) }}:</span>
                    <span class="text-right"><strong>${{ number_format($emailData['payment']['taxes'], 2) }}</strong></span>
                </p>
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('confirmation.packageTotal'):</span>
                    <span class="text-right"><strong>${{ number_format($emailData['payment']['total'], 2) }}</strong></span>
                </p>
            </div>
        </div>
        @if(!empty($transfer))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">Transportation</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>Amount:</span>
                            <span class="float-right"><strong>${{number_format($transfer['totalAmount'],2)}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
        @if(!empty($activity))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">Activity</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>Amount:</span>
                            <span class="float-right"><strong>${{number_format($activity['totalAmount'],2)}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
        @if(!empty($emailData['coupon']))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">Coupon</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="mb-0 py-2 d-flex justify-content-between">
                        <span>Coupon Code:</span>
                        <span class="text-right"><strong>{{$emailData['coupon']['code']}}</strong></span>
                    </p>
                </div>
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>Value:</span>
                            <span class="float-right"><strong>-${{number_format($emailData['coupon']['value'])}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
        @if($insurance)
            <div class="pb-3">
                <h6 class="mb-0">@lang('common.travelInsurance')</h6>
            </div>
            @if($emailData['hasInsurance'])
                <div class="row justify-content-between mb-2">
                    <div class="col-12 col-md-6">
                        @foreach(array_keys($emailData['insurance']['passengers']) as $passengerKey)
                            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                                <span>@lang('common.passenger') {{ $passengerKey }}:</span>
                                <span class="text-right"><strong>${{ number_format($emailData['insurance']['passengers'][$passengerKey]['cost'], 2) }}</strong></span>
                            </p>
                        @endforeach
                    </div>
                    <div class="col-12 col-md-6 d-flex">
                        <div class="d-flex w-100">
                            <p class="mb-0 py-2 w-100 align-self-end">
                                <span>@lang('confirmation.insuranceTotal'):</span>
                                <span class="float-right"><strong>${{ number_format($emailData['insurance']['total'], 2) }}</strong></span>
                            </p>
                        </div>
                    </div>
                </div>
            @else
                <div class="row justify-content-between mb-2">
                    <div class="col-12 col-md-6">
                        <p class="mb-0 py-2 d-flex justify-content-between">
                            <span><strong>@lang('common.manulifePolicy')#</strong></span>
                            <span class="text-right"><strong><span class="orange-text-lt">@lang('common.declined')</span></strong>
                            </span>
                        </p>
                    </div>
                    <div class="col-12 col-md-6">
                        <p class="mb-0 py-2 d-flex justify-content-between">
                            <span>@lang('confirmation.insuranceTotal'):</span>
                            <span class="text-right"><strong><span class="orange-text-lt">@lang('common.declined')</span></strong>
                            </span>
                        </p>
                    </div>
                </div>
            @endif
        @endif
        @if(isset($emailData['choose']))
            <div class="pb-3">
                <h6 class="mb-0">Choose Carbon Footprint</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span>Choose Carbon Footprint Total:</span>
                        <span class="text-right"><strong>${{ number_format($emailData['choose']['item']['price'], 2) }}</strong></span>
                    </p>
                </div>
            </div>
        @endif
        @if(!empty($emailData['payment']['airmilesCard']))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">@lang('confirmation.dreamMilesSummary')</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="mb-0 py-2 d-flex justify-content-between">
                        <span>@lang('confirmation.airMilesCollectorNumber'):</span>
                        <span class="text-right"><strong>{{preg_replace('/[0-9]{7}/', 'xxxxxxx', $emailData['payment']['airmilesCard'])}}</strong></span>
                    </p>
                </div>
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>@lang('confirmation.airMilesEarned'):</span>
                            <span class="float-right"><strong>{{floor($emailData['payment']['subTotal'] / 20)}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
    @else
        {{-- this is where the standalone payment information need to go --}}
        @if(!empty($hotel))
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span>{{$emailData['hotel']['numOfRooms']}} @lang('common.rooms') X {{$emailData['trip']['duration']}} @lang('common.nights'):</span>
                        <span class="text-right"><strong>${{ number_format($emailData['payment']['subTotal'], 2) }}</strong></span>
                    </p>
                </div>
                <div class="col-12 col-md-6">
                    <div class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span class="tooltipParent">
                            @lang('common.taxesFees')
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" xml:xlink="http://www.w3.org/1999/xlink">
                                <use xlink:href="/img/icons/icon-defs.svg#icon-exclamation-circle"></use>
                            </svg>
                            <div class="tooltip hide tooltip-top">
                                <div class="tooltip-inner">
                                    This charge includes estimated amounts the travel service provider (i.e. hotel, car rental company) pays for their taxes, and/or taxes that we pay, to taxing authorities on your booking (including but not limited to sales, occupancy, and value added tax). This amount may also include any amounts charged to us for resort fees, cleaning fees, and other fees and/or a fee we, the hotel supplier and/or the website you booked on, retain as part of the compensation for our and/or their services, which varies based on factors such as location, the amount, and how you booked. For more details, please see the Terms and Conditions.
                                </div>
                            </div>
                            :
                        </span>
                        <span class="text-right"><strong>${{ number_format($emailData['payment']['taxes'] - ($emailData['hotel']['salesTax'] ?? 0), 2) }}</strong></span>
                    </div>
                </div>
                @if(!empty($emailData['hotel']['salesTax']))
                <div class="col-12 col-md-6"></div>
                <div class="col-12 col-md-6">
                    <div class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span class="tooltipParent">
                            Sales Tax:
                        </span>
                        <span class="text-right"><strong>${{ number_format($emailData['hotel']['salesTax'], 2) }}</strong></span>
                    </div>
                </div>
                @endif
            </div>
        @endif
        @if(isset($emailData['choose']))
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                        <span>Choose Carbon Footprint Total:</span>
                        <span class="text-right"><strong>${{ number_format($emailData['choose']['item']['price'], 2) }}</strong></span>
                    </p>
                </div>
            </div>
        @endif
        @if(!empty($activity))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">Activity</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>Amount:</span>
                            <span class="float-right"><strong>${{number_format($activity['totalAmount'],2)}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
        @if(!empty($emailData['coupon']))
            <div class="pb-3 mt-4">
                <h6 class="mb-0">Coupon</h6>
            </div>
            <div class="row justify-content-between mb-2">
                <div class="col-12 col-md-6">
                    <p class="mb-0 py-2 d-flex justify-content-between">
                        <span>Coupon Code:</span>
                        <span class="text-right"><strong>{{$emailData['coupon']['code']}}</strong></span>
                    </p>
                </div>
                <div class="col-12 col-md-6 d-flex">
                    <div class="d-flex w-100">
                        <p class="mb-0 py-2 w-100 align-self-end">
                            <span>Value:</span>
                            <span class="float-right"><strong>-${{number_format($emailData['coupon']['value'])}}</strong></span>
                        </p>
                    </div>
                </div>
            </div>
        @endif
    @endif
    @if(!empty($emailData['payment']['petro']))
        <div class="pb-3 mt-4">
            <h6 class="mb-0">@lang('confirmation.petroPointSummary')</h6>
        </div>
        <div class="row justify-content-between mb-2">
            <div class="col-12 col-md-6">
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('confirmation.petroAccount'):</span>
                    <span class="text-right"><strong>{{preg_replace('/[0-9]{7}/', 'xxxxxxx', $emailData['payment']['petro']['petroCard'])}}</strong></span>
                </p>
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('confirmation.regularPointsEarned'):</span>
                    <span class="text-right"><strong>{{number_format($emailData['payment']['petro']['total'])}}</strong></span>
                </p>
            </div>
            @if($emailData['payment']['petro']['redeemDollarAmount'] > 0)
            <div class="col-12 col-md-6 d-flex">
                <div class="d-flex w-100">
                    <p class="mb-0 py-2 w-100 align-self-end">
                        <span>@lang('confirmation.petroPointsUsed'):</span>
                        <span class="float-right"><strong>{{number_format($emailData['payment']['petro']['redeemDollarAmount'] * 1000)}}(-{{number_format($emailData['payment']['petro']['redeemDollarAmount'], 2)}})</strong></span>
                    </p>
                </div>
            </div>
            @endif
        </div>
    @endif
    <div class="row no-gutters justify-content-end border-top-thicker">
        <p class="blue-text py-3"><strong>@lang('common.total') ({{$emailData['payment']['currency'] ?? 'CAD'}}): ${{ number_format($emailData['payment']['total'] + $emailData['insuranceTotal'] + (!empty($emailData['choose'])?$emailData['choose']['item']['price']:0) - (!empty($emailData['coupon'])?$emailData['coupon']['value']:0) + (!empty($transfer)?$transfer['totalAmount']:0) + (!empty($activity)?$activity['totalAmount']:0) , 2)    }}</strong></p>
    </div>
    @if(!$emailData['isStandalone'] && $emailData['hasAdditionalOptions'])
        <div class="border-top-thick py-3">
            <h5>Additional Options</h5>
            <span class="small">(Included in the price)</span>
        </div>
        <div class="row justify-content-between mb-2">
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span class="float-right">text option text</span>
                </p>
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span class="float-right">text option text</span>
                </p>
            </div>
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span class="float-right">text option text</span>
                </p>
                <p class="mb-0 py-2 d-flex justify-content-between">
                    <span class="float-right">text option text</span>
                </p>
            </div>
        </div>
    @endif
    <div class="border-top-thick py-3">
        <h5>@lang('confirmation.billingDetails')</h5>
    </div>
    <div class="row justify-content-between mb-2">
        @foreach($emailData['payment']['paymentCards'] as $idx=>$card)
            <div class="col-12">
                <h6 class="mb-0">@lang('common.creditCard') {{ $idx+1}}</h6>
            </div>
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('common.creditCardHolder'):</span>
                    <span class="text-right"><strong>{{ $card['name'] }}</strong></span>
                </p>
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('common.creditCardNumber'):</span>
                    <span class="text-right"><strong>{{ $card['cardMask'] }}</strong></span>
                </p>
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>@lang('common.expiryDate'):</span>
                    <span class="text-right"><strong>{{ $card['expiryDate'] }}</strong></span>
                </p>
                <p class="mb-0 py-2">
                    <span>@lang('common.cardType'):</span>
                    <span class="text-right"><strong>{{ $card['cardType'] }}</strong></span>
                </p>
            </div>

            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>@if(!$emailData['isStandalone'])
                            @lang('common.vacationPackage')
                        @else
                            @if(isset($activity))
                              @lang('common.activity')
                            @else
                                @lang('common.hotel')
                            @endif
                        @endif:<strong>({{$emailData['payment']['currency'] ?? 'CAD'}})</strong></span>
                    <span class="text-right"><strong>${{ number_format($card['amount'], 2) }}</strong></span>
                </p>
                
                @if($insurance)
                    @if(!$emailData['isStandalone'] && $idx === 0)
                        <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                            <span>@lang('common.insurance'):<strong>({{$emailData['payment']['currency'] ?? 'CAD'}})</strong></span>
                            @if($emailData['hasInsurance'])
                                <span class="text-right"><strong>${{ number_format($emailData['insurance']['total'], 2) }}</strong></span>
                            @else
                                <span class="text-right red-text"><strong>@lang('common.declined')</strong></span>
                            @endif
                        </p>
                    @endif
                @endif
                @if(isset($emailData['choose']))
                    @if($idx === 0)
                        <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                            <span>Carbon Footprint:<strong>({{$emailData['choose']['currency']}})</strong></span>
                            <span class="text-right"><strong>${{ number_format($emailData['choose']['item']['price'], 2) }}</strong></span>
                        </p>
                    @endif
                @endif
                @if($emailData['hasOpc'])
                    <p class="mb-0 py-2 d-flex justify-content-between">
                        <span>OPC</span>
                        <span class="text-right"><strong>0</strong></span>
                    </p>
                @endif
            </div>
        @endforeach
    </div>
    <div class="border-top py-3">
        <h6 class="mb-0">@lang('common.billingAddress')</h6>
    </div>
    <div class="row justify-content-between mb-2">
        <div class="col-12 col-md-6">
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.address'):</span>
                <span class="text-right"><strong>{{$emailData['contact']['address']}}</strong></span>
            </p>
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.country'):</span>
                <span class="text-right"><strong>{{$emailData['contact']['country']}}</strong></span>
            </p>
            <p class="mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.city'):</span>
                <span class="text-right"><strong>{{$emailData['contact']['city']}}</strong></span>
            </p>
        </div>
        <div class="col-12 col-md-6">
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.' . (config('site.site') === 'copolo' ? 'state' : 'province')):</span>
                <span class="text-right"><strong>{{$emailData['contact']['province']}}</strong></span>
            </p>
            <p class="mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.' . (config('site.site') === 'copolo' ? 'zip' : 'postalCode')):</span>
                <span class="text-right"><strong>{{$emailData['contact']['postal']}}</strong></span>
            </p>
        </div>
    </div>
    @if(!empty($emailData['payment']['deposit']))
        <div class="border-top py-3">
            <h6 class="mb-0">@lang('confirmation.refundableBalance')</h6>
        </div>
        <div class="row justify-content-between mb-2">
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>Balance Due:</span>
                    <span class="text-right"><strong>${{number_format($emailData['payment']['total'] - $emailData['payment']['deposit'], 2)}}</strong></span>
                </p>
            </div>
            <div class="col-12 col-md-6">
                <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                    <span>Balance Due Date:</span>
                    <span class="text-right"><strong>{{$emailData['payment']['balanceDueDate']}}</strong></span>
                </p>
            </div>
        </div>
    @endif
    {{-- <div class="border-top py-3">
        <h6 class="mb-0">Outstanding Balance</h6>
    </div>
    <div class="row justify-content-between mb-2">
        <div class="col-12 col-md-6">
            <p class="mb-0 py-2">
                <span>Balance Due:</span>
                <span class="float-right red-text"><strong>$0.00</strong></span>
            </p>
        </div>
        <div class="col-12 col-md-6">
            <p class="mb-0 py-2">
                <span>Balance Due Date:</span>
                <span class="float-right"><strong>Thu, Aug 30, 2018</strong></span>
            </p>
        </div>
    </div> --}}
    <div class="border-top-thick py-3">
        <h5 class="mb-0">@lang('common.agencyDetails')</h5>
    </div>
    <div class="row justify-content-between mb-2">
        <div class="col-12 col-md-6">
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.companyName'):</span>
                <span class="text-right"><strong>{{config('site.name')}}</strong></span>
            </p>
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.address'):</span>
                <span class="text-right"><strong>{{config('site.address')}}</strong></span>
            </p>
            <p class="mb-0 border-bottom py-2 d-flex justify-content-between">
                <span>@lang('common.city'):</span>
                <span class="text-right"><strong>{{config('site.city')}}</strong></span>
            </p>
        </div>
        <div class="col-12 col-md-6">
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.' . (config('site.site') === 'copolo' ? 'zip' : 'postalCode')):</span>
                <span class="text-right"><strong>{{config('site.postal')}}</strong></span>
            </p>
            <p class="border-bottom mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.phoneNumber'):</span>
                <span class="text-right"><strong>{{config('site.phone')}}</strong></span>
            </p>
            <p class="mb-0 py-2 d-flex justify-content-between">
                <span>@lang('common.' . (config('site.site') === 'copolo' ? 'state' : 'province')):</span>
                <span class="text-right"><strong>{{config('site.province')}}</strong></span>
            </p>
        </div>
    </div>
    <div class="border-top-thick py-3">
        <h5 class="mb-0 red-text">@Lang('confirmation.needHelp')?</h5>
    </div>
    <div class="row no-gutters">
        <p>@Lang('confirmation.customerCareMessage') <strong>{{config('site.phone')}}.</strong></p>
    </div>
    <div class="border-top-thick py-3">
        <div class="row no-gutters">
            <div class="col-12 col-md text-center text-md-left">
                <small>{{config('site.address')}} {{config('site.city')}}, ON {{config('site.postal')}}, T {{config('site.phone')}} F {{config('site.fax')}}</small>
            </div>
        </div>
    </div>
</div>
    @component('components.uplift-confirm', $emailData)
    @endcomponent

    @if(!empty(config('site.gtmTRacking')))
    <!-- Event snippet for Purchase conversion page -->
    <script>
      gtag('event', 'conversion', {
          'send_to': '{{config('site.gtm_tracking')}}',
          'value': {{$emailData['payment']['total']}},
          'currency': '{{$emailData['payment']['currency'] ?? 'CAD'}}',
          'transaction_id': ''
      });
    </script>
    @endif

<!-- register events before script is loaded (optional) -->
<script type="text/javascript">
  var eventTypes = [
    'sdkLoaded'
  ]
    // Register the onSherpaEvent under the globnal window scope before the script is loaded
  function onSherpaEvent(event) {
    console.warn('Event from Sherpa SDK:')
    console.log({
      event
    })
  }
</script>

<!-- load script -->
<script src="https://sdk.joinsherpa.io/widget.js?appId={{config('site.sherpa_key')}}"></script>
<script type="text/javascript">
    var elementConfig = {
        placement: 'bookingConfirmation',
    };
    @if(!empty($emailData['flight']))
        @php
            $outDepDateTime = explode('T', $emailData['flight']['itineraries'][0]['departureDateTime']);
            $outArrDateTime = explode('T', $emailData['flight']['itineraries'][0]['arrivalDateTime']);
            $retDepDateTime = explode('T', $emailData['flight']['itineraries'][1]['departureDateTime']);
            $retArrDateTime = explode('T', $emailData['flight']['itineraries'][1]['arrivalDateTime']);
        @endphp
        elementConfig.segments = [
            {
                segmentType: 'OUTBOUND',
                origin: {
                    airportCode: '{{$emailData['flight']['itineraries'][0]['originCode']}}',
                },
                destination: {
                    airportCode: '{{$emailData['flight']['itineraries'][0]['destinationCode']}}',
                },
                departureDate: '{{$outDepDateTime[0]}}',
                departureTime: '{{substr($outDepDateTime[1],0, 5)}}:00',
                arrivalDate: '{{$outArrDateTime[0]}}',
                arrivalTime: '{{substr($outArrDateTime[1],0, 5)}}:00',
            },
            {
                segmentType: 'RETURN',
                origin: {
                    airportCode: '{{$emailData['flight']['itineraries'][1]['originCode']}}',
                },
                destination: {
                    airportCode: '{{$emailData['flight']['itineraries'][1]['destinationCode']}}',
                },
                departureDate: '{{$retDepDateTime[0]}}',
                // departureTime: '12:59:00',
                arrivalDate: '{{$retArrDateTime[0]}}',
                // arrivalTime: '12:59:00',
            },
        ];
    @endif
</script>
<!-- AcuityAds Pixel -->
<script>
    'use strict'
    !(function(a, e) {
        if (!a.aap) {
            a.acuityAdsPixelKey = '2987320103196260720'
            a.aap = function(e) {
                ;(a.acuityAdsEventQueue = a.acuityAdsEventQueue || []).push(e)
            }
            var t = 'script'
            var i = e.createElement(t)
            i.async = true
            i.src = 'https://origin.acuityplatform.com/event/v2/pixel.js'
            var c = e.getElementsByTagName(t)[0]
            c.parentNode.insertBefore(i, c)
            a.acuityPiggybackCallback = function(e) {
                a.acuityParseResponse(e)
            }
        }
    })(window, document)
    aap(@if($siteSection === 'dynamic') 9836 @else 9840 @endif);
</script>
<!-- AcuityAds Pixel -->

<script type="text/javascript">
    var googleData = {
        event: "purchase",
        ecommerce: {
            transaction_id: "{{$emailData['bookingNumber']}}",
            value: "{{$emailData['payment']['total']}}",
            tax: "{{$emailData['payment']['taxes']}}",
            currency: "{{$emailData['payment']['currency'] ?? config('app.currency')}}",
            coupon: "",
            items: []
        }
    };

    @if(!empty($emailData['hotel']))
        googleData.ecommerce.items.push({
            item_name: "{{$emailData['hotel']['name']}}",
            item_category: "hotel",
            quantity: 1
        });
    @endif
    @if(!empty($emailData['flight']))
        googleData.ecommerce.items.push({
            item_name: "{{$emailData['flight']['flightId']}}",
            item_category: "flight",
            quantity: 1
        });
    @endif
    console.log(googleData);
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push(googleData);

    var digitalData =  {
        page:{
            site_section:"{{$siteSection}}",
            pageInfo:{
                sub_section: "Desktop",
                site_section: "{{$siteSection}}",
                pageID: "305", //from CMS if applicable
                language: "en-US", //set as the context of the page and not the browser
                pageType: "cart" //types can include - product detail, product collection, search, cart, catalog, about, homepage, weekly ad, etc.
            },
            category:{
                primaryCategory: "{{$siteSection}}", //considered site section
            },
            user:{
                attributes:{
                    loginStatus: "Not Logged In" //would contain values of "Logged In" or "Not Logged In"
                }
            }
        },
        transaction:{
            transactionID:"{{$emailData['bookingNumber']}}",
            tourOperator:"{{empty($hotel)?'':$emailData['hotel']['vendor']}}",
            adultTravelers:"{{$adults}}",
            childTravelers:"{{$children}}",
            transactionStatus:"{{$bookingStatus}}",
            bookingDate:"{{$bookingDate}}",
            bookingOrigin:"{{$bookingOrigin}}",
            bookingDestination:"{{$emailData['trip']['destinationCode']}}",
            tripDuration:"{{$emailData['trip']['duration']}} days",
            returnDate:"{{$returnDate}}",
            profile:{
                address:{
                    //corresponds to billing address
                    city: "{{$emailData['contact']['city']}}",
                    stateProvince: "{{$emailData['contact']['province']}}",
                    postalCode: "{{$emailData['contact']['postal']}}",
                    country: "{{$emailData['contact']['country']}}",
                },
                shippingAddress:{
                    city: "{{$emailData['contact']['city']}}",
                    stateProvince: "{{$emailData['contact']['province']}}",
                    postalCode: "{{$emailData['contact']['postal']}}",
                    country: "{{$emailData['contact']['country']}}",
                }
            },
            total:{
                basePrice: "{{$emailData['payment']['total']}}", //cart total before coupon or discounts
                currency: "{{$emailData['payment']['currency'] ?? 'CAD'}}", //3 character standard for curency code
                tax: "{{$emailData['payment']['taxes']}}", //tax applied to visitor's order
            },
            attributes:{
                paymentMethod: "normal",
                noofcard: "{{$numberofCard}}",
            },
            item:[{
                    productInfo:{
                        productID: "{{empty($hotel)? '':$emailData['hotel']['id']}}",
                        productName: "{{empty($hotel)? '':$emailData['hotel']['name']}}",
                        sku: "", //if applicable
                        manufacturer: "{{empty($hotel)? '':$emailData['hotel']['vendor']}}" //product provider or vendor
                    },
                    category:{
                        primaryCategory: "hotels",
                    },
                    quantity: 1,
                    price: "{{empty($hotel)? '':$emailData['hotel']['total']}}", //price of single unit
                    tax: "{{empty($hotel)? '':$emailData['hotel']['taxes']}}", //price of single unit
            },
            @if(isset($emailData['flight']))
            {
                productInfo:{
                    productID: "{{$emailData['flight']['flightId']}}",
                    productName: "{{$emailData['flight']['flightId']}}",
                    sku: "", //if applicable
                    manufacturer: "" //product provider or vendor
                },
                category:{
                    primaryCategory: "flights"
                },
                quantity: 1,
                price: "{{$emailData['flight']['total']}}", //price of single unit
                tax: "{{$emailData['flight']['taxes']}}", //price of single unit
                @if(isset($emailData['insurance']))
                    insurance: {
                        insuranceId : "{{$emailData['insurance']['bookingNumber']}}",
                        total : "{{$emailData['insurance']['total']}}"
                    }
                @endif
            }
            @endif
            ]
        }
    };
</script>
@stop
