@php
    $pageTitle = 'Index';
@endphp

@extends('template')

@section('content')
	<div id="dyn_index" data-parameters='{"lang": "{{App::getLocale()}}" }' data-features="{{json_encode($features)}}"
data-profileconfig="{{json_encode($profileConfig)}}"></div>
@stop
