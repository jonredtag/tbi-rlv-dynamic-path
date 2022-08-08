@php
$depDateFormat = str_replace('-', '', $depDate);
$retDateFormat = str_replace('-', '', $retDate);
@endphp

@include('components.uplift-init')

<script type="text/javascript">    
    var tripInfo = {};
    window.upReady = function () {
        console.log("uplift called");
        Uplift.Payments.init(
            {
                apiKey: UPLIFT_API_KEY,
                locale:  '<?= env('CURRENCY_TYPE', 'CAD')=='USD'? 'en-US':'en-CA' ?>',
                currency :'<?= env('CURRENCY_TYPE', 'CAD')=='USD'? 'USD':'CAD' ?>',
            }
        );
        // Load trip information
        tripInfo = {
            "hotel_reservations": [
                {
                "check_in": '<?=$depDateFormat?>',
                "check_out": '<?=$retDateFormat?>'
                }
            ],
            "travelers": [
                {
                "id": 0,
                "first_name": "pax-first-0",
                "last_name": "pax-last-0"
                }
            ]
        };
        Uplift.Payments.load(tripInfo, function(){});
    };

    UpliftLibInit();

</script>