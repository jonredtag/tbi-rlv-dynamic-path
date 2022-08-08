@php
    $pageTitle = 'Hotel Manager';
@endphp

@extends('template')

@section('content')
	<div class="container">
        <h4>Hotel Manager</h4>
		<div id="hotelManagerApp" data-parameters="{{json_encode($parameters)}}"></div>
	</div>
@stop
