@php
    $pageTitle = 'Hotel Deal';
@endphp

@extends('template')

@section('content')
	<div
		id="dyn_hotelDeal"
		data-sid="{{$sid}}"
		data-details="{{ json_encode($data) }}"
		data-parameters="{{json_encode($searchParameters)}}"
		data-features="{{json_encode($features)}}"
		data-profileconfig="{{json_encode($profileConfig)}}"
	></div>
@stop
