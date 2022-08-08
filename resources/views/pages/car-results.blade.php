@php
    $pageTitle = 'Car Results';
@endphp

@extends('template')

@section('content')


    @if(config('site.multi_payment') && !empty($searchParameters))
        @component('components.uplift-ready', $searchParameters)
        @endcomponent
    @endif

    <div
        id="dyn_carSearchResults"
        data-sid="{{$sid}}"
        data-parameters="{{json_encode($searchParameters)}}"
        data-breadcrumbs="{{json_encode($breadcrumbs)}}"
        data-features="{{json_encode($features)}}"
        data-profileconfig="{{json_encode($profileConfig)}}"
    ></div>

    <script type="text/javascript">
        var isIncremental = {{$isIncremental ? 'true': 'false'}};
    </script>
@stop
