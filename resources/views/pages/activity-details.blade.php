@php
    $pageTitle = 'Activities Details';
    $siteSection = 'activity';
@endphp

@extends('template')

@section('content')
	
	<div
        id="dyn_activityDetails"
        data-activity="{{ $activityIndex }}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-sid="{{$sid}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-features="{{json_encode($features)}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
    ></div>
    <script type="text/javascript">
        var digitalData = {
            page: {
                site_section:"{{$siteSection}}",
                pageInfo: {
                    sub_section: "Desktop",
                    pageID: "302",
                    site_section: "{{$siteSection}}",
                    language: "en-US",
                    pageType: "activity details",
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
            productID: '{{ $activityIndex }}', //set on product detail pages product ID
            productName: '{{$name}}', //Set with the friendly name of the product
            tripAdvisorRating: 'No Trip Advisor',
            }],
        };
</script>
@stop
