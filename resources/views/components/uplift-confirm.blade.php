@if($payment['paymentMethod'] =='loan')
    @include('components.uplift-init')
    <script type="text/javascript">
            UpliftLibInit();
            window.upReady = function() {
             // Call Uplift.Payments.init(options) with only your api key
             Uplift.Payments.init(
                     {
                        apiKey: UPLIFT_API_KEY,
                        locale:"en-CA",
                        currency :"CAD"                   
                    }
                 );   
             // ... next confirm the booking with Uplift:
             @if($isConfirmed)
                 Uplift.Payments.confirm('{{$bookingNumber}}');
             @else    
                 Uplift.Payments.error('Booking Error');
            @endif     
           }
         </script>
@endif 