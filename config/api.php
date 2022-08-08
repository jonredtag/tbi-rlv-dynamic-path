<?php

return [
    'hotel_search_text' =>env('HOTEL_SEARCH_TEXT', 'https://api-beta1.divinia.ai/api/'),
    'hotel' =>env('HOTEL_API', 'http://res.flights.ca/hotelslib/tests/'), //live
    'flight' =>env('FLIGHT_API', 'https://api.redtag.ca/v1/backend/flights/'),
    'flight-refundable' =>env('FLIGHT_REFUNDABLE_API', 'https://res.sunquest.ca/flights_new/'),
    'car' => 'https://secure.redtag.ca/res-api/cars/api/',
    'transfer'=>env('TRANSFER_API', 'https://api.test.hotelbeds.com/transfer-api/1.0/') ,
    'activity'=>env('ACTIVITY_API', 'https://api.test.hotelbeds.com/activity-api/3.0/') ,
    'flight-autocomplete' => 'http://api.redtag.ca/v1/autocomplete/flights',
    'insurance' => 'http://api.travelbrands.com/insurance/uat/',
    'paymentVcc' => env('VCC_PAYMENT_URL', "https://webservices-ext.qa.travelbrands.com/US_BankCPM/USBankCPM_WCF.CPM_Service.svc?singleWsdl"),
    'dashboard-feeds' => 'http://dashboard.travelbrands.com/feeds/',
    'promo' => env('FEED_URL', 'http://dashboard.travelbrands.com').'/promo/',
    'profile' => env('PROFILE_API', 'https://stg1.copolo.com'),
];
