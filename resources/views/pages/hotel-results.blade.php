@php
    $pageTitle = 'Hotel Results';
@endphp

@extends('template')

@section('content')


    @if(config('site.multi_payment') && !empty($searchParameters))
        @component('components.uplift-ready', $searchParameters)
        @endcomponent
    @endif

	<div
        id="dyn_hotelSearchResults"
        data-sid="{{$sid}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-features="{{json_encode($features)}}"
        data-googleApiKey="{{config('services.google.map_api_key')}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
    ></div>

	<script type="text/javascript">
		var isIncremental = {{$isIncremental ? 'true': 'false'}};
    	var isRefundablePath = {{$isRefundablePath ? 'true': 'false'}};
	</script>
    <!-- Adobe Launch -->

    @php
        $siteSection = $searchParameters['selectedProducts']=='FH'?'dynamic':'hotels';
        $adult=0;
        $child=0;
        foreach($searchParameters['occupancy'] as $occupancy){
            $adult += $occupancy['adults'];
            $child += $occupancy['children'];
        }
        $currentDate=date_create(date('Y-m-d'));
        $departDate=date_create($searchParameters['depDate']);
        $returnDate=date_create($searchParameters['retDate']);
        $searchInAdvance=date_diff($currentDate,$departDate);
        $duration=date_diff($departDate,$returnDate)->format("%a days");
        $departDate=date_format($departDate,"d/m/Y");
        $returnDate=date_format($returnDate,"d/m/Y");
        $list = 'destination^'.$searchParameters["destination"]["value"].'|duration^'.$duration.'|adults^'.$adult.'|children^'.$child.'|room^'.count($searchParameters["occupancy"]).'|departureDate^'.$departDate.'|returnDate^'.$returnDate;
        $searchOrigin=(isset($searchParameters['departure']['value']))?$searchParameters['departure']['value']:'';
        if($searchParameters['selectedProducts']=='FH'){
            $list = 'origin^'.$searchParameters['departure']['value'].'|'.$list;
        }
    @endphp
    <script type="text/javascript">
        var digitalData = {
            page: {
                site_section:"{{$siteSection}}",
                pageInfo: {
                    sub_section: "Desktop",
                    pageID: "301",
                    site_section: "{{$siteSection}}",
                    language: "en-US",
                    pageType: "search results",
                },
                attributes:{
                    searchAdults:{{$adult}},
                    searchChildren:{{$child}},
                    searchCategory:'hotels',
                    searchDaysInAdvance:{{$searchInAdvance->format("%a")}},
                    searchDestination:"{{$searchParameters['destination']['value']}}",
                    searchOrigin:"{{$searchOrigin}}",
                    searchResults:0,
                    searchAllFacet:'{{$list}}',
                    depDate:'{{$searchParameters['depDate']}}',
                    retDate:'{{$searchParameters['retDate']}}',
                    diviniaSearch:'{{$searchParameters['hotelSearch'] ?? ''}}'
                },
                user: {
                    attributes: {
                        loginStatus: "Not Logged In" //would contain values of "logged-in" or "logged-out"
                    }
                },
                category: {
                    primaryCategory: "{{$siteSection}}",
                }
            }
        };
    </script>
<!-- Adobe Launch -->
@stop
