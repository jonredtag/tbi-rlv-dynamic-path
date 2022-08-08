@php
    $pageTitle = 'Hotel Details';
    $siteSection = $searchParameters['selectedProducts']=='FH'?'dynamic':'hotels';
@endphp

@extends('template')

@section('content')
	@if(env('URGENCY_BAR'))
		<div id="urgencyBar"
	        data-bgcolor="#E5D265"
	        data-displaytype="mousemove"
	        data-context="search"
	        data-product="hotel"
	        data-productkey="hotel"
	        data-randomfactor="6">
	    </div>
    @endif
     @if(config('site.multi_payment') && !empty($searchParameters))
        @component('components.uplift-ready', $searchParameters)
        @endcomponent
    @endif
	<div
        id="dyn_hotelDetails"
        data-hotel="{{ $hotelID }}"
        data-sid="{{$sid}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-features="{{json_encode($features)}}"
        data-googleApiKey="{{config('services.google.map_api_key')}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
    ></div>
    <script type="text/javascript">
        var isRefundablePath = {{$isRefundablePath ? 'true': 'false'}};
        var digitalData = {
            page: {
                site_section:"{{$siteSection}}",
                pageInfo: {
                    sub_section: "Desktop",
                    pageID: "302",
                    site_section: "{{$siteSection}}",
                    language: "en-US",
                    pageType: "hotel details",
                },
                user: {
                    attributes: {
                        loginStatus: "Not Logged In" //would contain values of "logged-in" or "logged-out"
                    }
                },
                category: {
                    primaryCategory: "{{$siteSection}}"
                }
            },
            product: [{
            productID: '{{ $hotelID }}', //set on product detail pages product ID
            productName: '{{$hotelName}}', //Set with the friendly name of the product
            tripAdvisorRating: 'No Trip Advisor',
            }],
        };
</script>
@stop
