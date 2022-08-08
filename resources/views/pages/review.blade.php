@php
    $pageTitle = 'Review';
    $siteSection = $searchParameters['selectedProducts']=='FH'?'dynamic':'hotels';
@endphp

@extends('template')

@section('content')
   <div
        id="dyn_review"
        data-sid="{{$sid}}"
        data-tripinformation="{{json_encode($tripInformation)}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-features="{{json_encode($features)}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-features="{{json_encode($features)}}"
    ></div>
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
