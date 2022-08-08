there was an error in the booking process.

@if(!empty($nonRefFail))
    <p style="font-size:17px; margin:0;">
        The booking of the non-refundable hotel has failed. will need to try to rebook hotel.<br />

        <strong>Location:</strong> {{$hotelData['location']}} <br />
        <strong>Checkin Date:</strong> {{$hotelData['checkinDate']}} <br />
        <strong>Checkout Date:</strong> {{$hotelData['checkoutDate']}} <br />
        <strong>Hotel Name:</strong> {{$hotelData['hotelName']}} <br />
        <strong>Is Refundable:</strong> {{$hotelData['isRefundable'] == '1' ? 'true' : 'false'}} <br />
        <strong>Room Option:</strong> {{$hotelData['roomOption']}} <br />
        <strong>rooms:</strong>
        @foreach($hotelData['rooms'] as $room)
            <br />
            <strong>Room {{$loop->iteration}}</strong><br />
            Adults: {{$room['adults']}}<br />
            @if(!empty($room['ages']))
            children: {{implode(', ', $room['ages'])}}<br />
            @endif
        @endforeach
    </p>
    <br />
@endif

@if(!empty($paymentFailed))
    <p style="font-size:17px; margin:0;">
        The capture for the payement failed, we will need to collect ${{$payment['total']}} from the customer.<br />
        Customer Contact:<br />
        Name: {{$passengers[0]['name']}}<br />
        Phone: {{$contact['phoneNumber']}}<br />
        Email: {{$contact['email']}}<br />
    </p>
    <br />
@endif


@if(!empty($hotel))
    <p style="font-size:17px; margin:0; color: #1a3c5e;">
        <strong>Hotel:</strong>
    </p>
    <p style="font-size:15px; line-height: 30px; margin:0; color: #e86148;"><strong>Hotel booking #{{$hotel['bookingNumber']}}</strong></p>
    <p style="font-size: 15px; line-height: 21px; color: #444449; margin: 5px 0 0;">
        <strong>Hotel:</strong> {{$hotel['name']}}<br />
        {{-- <strong>Address:</strong> {{$hotel['address']}}<br /> --}}
        <strong>Room Type:</strong> {{$hotel['roomType']}}<br />
        {{-- <strong>Adults:</strong> {{$hotel['adults']}} Children: {{$hotel['children']}}<br /> --}}
        <strong>Check-in:</strong> {{date('M j, Y', strtotime($hotel['checkIn']))}} <br />
        <strong>Check-out:</strong> {{date('M j, Y', strtotime($hotel['checkOut']))}}<br />
        {{-- <strong>Nights:</strong> {{$hotel['nights']}}<br /> --}}
        {{-- @if(!empty($hotel['smokingPreference']))<strong>Smoking Preferences:</strong> {{$hotel['smokingPreference']}} <br />@endif --}}
        {{-- <strong>Name:</strong> {{$hotel['traveller']}} --}}
    </p>
    <br />
@endif
@if(!empty($flight))
<table>
    <tr>
        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
            <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('common.flightDetails')</p>
            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$flight['bookingNumber']}}</span></p>
            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('common.departure')</p>
        </td>
    </tr>


    <tr>
        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;" >
            <p style="margin-right:0;margin-left:0;line-height:18px;font-size:17px;margin-bottom:10px;margin-top:0px;" >{{ $flight['itineraries'][0]['segments'][0]['depDate'] }}</p>
        </td>
    </tr>

    @foreach($flight['itineraries'][0]['segments'] as $segment)
    <tr>
        <td class="inner" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;" >
            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;">
                <tr>
                    <td class="" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:20%;" >
                        <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/{{ strtolower($segment['carrierCode']) }}.png" border="0" alt="airline logo" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                    </td>
                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                        <p class="d-inline" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:12px;color:#7d7d7d;padding-left:10px;display:inline-block;" >
                            <br> @lang('common.flight') #{{ $segment['flightNumber'] }}
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td width="45%" class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:45%;">
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e;font-weight: bold">{{ $segment['depTime'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['departureCode'] }}</b> {{ $segment['departureCity'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['depDate'] }}</p>
                                </td>
                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e; font-weight: bold">{{ $segment['arrTime'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['destinationCode'] }}</b> {{ $segment['destinationCity'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['arrDate'] }}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endforeach

    <tr>
        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
            &nbsp;
        </td>
    </tr>

    <tr>
        <td colspan="2" class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;margin-bottom:0px;margin-top:10px;font-weight:bold;">@lang('common.return')</p>
        </td>
    </tr>
    <tr>
        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;" >
            <p style="margin-right:0;margin-left:0;line-height:18px;font-size:17px;margin-bottom:10px;margin-top:0px;" >{{ $flight['itineraries'][1]['segments'][0]['depDate'] }}</p>
        </td>
    </tr>

    @foreach($flight['itineraries'][1]['segments'] as $segment)
    <tr>
        <td class="inner" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;" >
            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;">
                <tr>
                    <td class="" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:20%;" >
                        <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/{{ strtolower($segment['carrierCode']) }}.png" border="0" alt="airline logo" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                    </td>
                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                        <p class="d-inline" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:12px;color:#7d7d7d;padding-left:10px;display:inline-block;" >
                            <br> @lang('common.flight') #{{ $segment['flightNumber'] }}
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td width="45%" class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:45%;">
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e;font-weight: bold">{{ $segment['depTime'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['departureCode'] }}</b> {{ $segment['departureCity'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['depDate'] }}</p>
                                </td>
                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e; font-weight: bold">{{ $segment['arrTime'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['destinationCode'] }}</b> {{ $segment['destinationCity'] }}</p>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['arrDate'] }}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endforeach
</table>
@endif

@if(!empty($car))
    <p style="font-size:17px; margin:0; color: #1a3c5e;">
        <strong>Car:</strong>
    </p>
    <p style="font-size:15px; line-height: 30px; margin:0; color: #e86148;"><strong>Hotel booking #{{$car['bookingNumber']}}</strong></p>
    <p style="font-size: 15px; line-height: 21px; color: #444449; margin: 5px 0 0;">
        <strong>Model:</strong> {{$car['name']}}<br />
        <strong>pickup:</strong> {{$car['pickup']['name']}} - {{$car['pickup']['address']}}: {{$car['pickupDateTime']}}<br />
        <strong>dropoff:</strong> {{$car['dropoff']['name']}} - {{$car['dropoff']['address']}}: {{$car['dropoffDateTime']}}<br />

    </p>
    <br />
@endif
@if(!empty($passengers))
<p style="font-size: 15px; line-height: 21px; color: #444449; margin: 5px 0 0;">
    <strong>Passenger Information:</strong>
    <br /><br />
    @foreach($passengers as $passenger)
    <strong>Passenger #{{$loop->iteration}}:</strong> {{$passenger['name']}} ({{date('F, j. Y', strtotime($passenger['birthDate']))}})<br />
    @if($loop->index === 0)
    <strong>EMail:</strong> {{$contact['email']}}<br />
    <strong>Phone:</strong> {{$contact['phoneNumber']}} <br />
    @endif
    @endforeach
</p>
@endif
