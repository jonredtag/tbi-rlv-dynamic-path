@php
    $pageTitle = 'Payment';
    $siteSection = $searchParameters['selectedProducts']=='FH'?'dynamic':($searchParameters['selectedProducts']=='A'?'activities': 'hotels');

@endphp

@extends('template')

@section('content')
    @if(env('URGENCY_BAR'))
    	<div id="urgencyBar"
            data-displaytype="timeout"
            data-context="payment"
            data-timeoutduration="4000"
            data-product="hotel"
            data-productkey="hotel"
            data-randomfactor="3"
        >
        </div>
    @endif
    @if($siteSection != 'activities' &&  config('site.multi_payment') && !empty($searchParameters))
        @component('components.uplift-init', $searchParameters)
        @endcomponent
    @endif
	<div
        id="dyn_checkout"
        data-sid="{{$sid}}"
        data-tripinformation="{{json_encode($tripInformation)}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-insuranceoptions="{{ json_encode(['token'=>config('site.ins_affiliate'), 'provinces' => config('site.ins_provinces')])}}"
        data-user="{{ json_encode($user ?? '')}}"
        data-features="{{json_encode($features)}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
        data-localization="{{$localization}}"
        data-site="{{config('site.name')}}"
    ></div>
	<script type="text/javascript">
	    var PETRO_API_VER = '2';
	    // var PETRO_API_LINK = '';
	    var PETRO_POINTS_INCR = 10;
	    var PETRO_POINTS_DECR = 1000;
	    var WEBSITE = "itravel2000.com";
	    var TERMS_URL = '{{str_replace(':locale:', App::getLocale(), config('site.terms_url'))}}';
        var REFUNDABLE_TERMS_URL = '{{str_replace(':locale:', App::getLocale(), config('site.refundable_terms_link'))}}';
        var isRefundablePath = {{$isRefundablePath ? 'true': 'false'}};
      	</script>
    <script type="text/javascript">
        var digitalData = {
            page: {
                site_section:"{{$siteSection}}",
                pageInfo: {
                    sub_section: "Desktop",
                    pageID: "304",
                    site_section: "{{$siteSection}}",
                    language: "en-US",
                    pageType: "cart",
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
            product: [],
        };
    </script>
@stop
