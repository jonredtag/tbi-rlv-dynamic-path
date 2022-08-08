<?php
return [
	'enabled' => env('ACCERTIFY_ENABLE', true),
	'scoreRange' => [
	    'low' => ['min' => -1000, 'max' => 299],
	    'medium' => ['min' => 300, 'max' => 699],
	    'high' => ['min' => 700, 'max' => 9999999],
	],
	'authtokensid' => '4961e95a72394f7e',
	'authtokencurl' => 'https://www.cdn-net.com',
	'authenticationKey' => 'ax1fgmt65ui3hgst1po7b',
	// 'url' => 'https://webservices-ext.qa.travelbrands.com/Accertify/AccertifyService.asmx/AccertifyProcessB2CTest',
	'url' => 'https://webservices-ext.travelbrands.com/Accertify/AccertifyService.asmx/AccertifyProcessB2CTest',
];

