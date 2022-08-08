@php
    $pageTitle = 'Error';
@endphp

@extends('template')

@section('content')
    <div class="container">
	   <h1>Oops, {{ $error['message'] ?? 'An unknown error occurred'}}</h1>
       <a href="{{$error['url'] ?? config('site.url')}}" class="btn btn-lg btn-primary">Reload</a>
    </div>
@stop
