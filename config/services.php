<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'choose' => [
        'clientID' => env('CHOOSE_ID', "1c60be65-c67b-48a5-ad39-5e9cdea09222"), //"0dd32f59-bede-4498-ab3d-c23d9fd7a734"
        'clientsecret' => env('CHOOSE_SECRET', "Go9lj4k9J.4~CDU~0~ONX2P3Lettut4p.s"), // //uVjWbC9E9XzZslyqCyS.51qDiMK74PuyLE
        'create_token_url' =>"https://login.microsoftonline.com/04300fc2-8f04-4555-9a5d-c6fac7f23d0c/oauth2/token",
        'resource_url' => env('CHOOSE_RESOURCE', "https://partner-test.api.chooose.today"),
        'stripe_api_key' => env('CHOOSE_STRIPE_APIKEY', 'pk_test_3NSlsvOcG1F5mwPSsDOR68nd'),
        'stripe_url' => 'https://api.stripe.com/',
    ],
    'hotels' => [
        'providers' => explode('|', env('HOTEL_PROVIDERS', 'TBI|PRICELINE')),
    ],
    'google' => [
        'map_api_key' => env('GOOGLE_MAPS_API',''),
    ],
    'profile' => [
        'url' => env('PROFILE_API', 'https://stg1.copolo.com'),
        'dashboard_url' => env('PROFILE_DASHBOARD_URL', 'https://stg1.copolo.com/my-account/edit'),
        'google_client_id' => env('PROFILE_GOOGLE_CLIENT_ID', '917373304598-uc98b34ll7koq5pkupje2vpfcrl4iaas.apps.googleusercontent.com'),
        'facebook_client_id' => env('PROFILE_FACEBOOK_CLIENT_ID', '1317582572093606'),
        'features' => 
            [
                'facebook' => (env('PROFILE_FACEBOOK_ENABLED', true)),
                'google' => (env('PROFILE_GOOGLE_ENABLED', true)),
            ],
        'logo' => [
            // 'url' => env('PROFILE_LOGO_URL', 'https://redtag-ca.s3.amazonaws.com/img/branding/logo-redtag-chevron.svg'),
            'url' => env('PROFILE_LOGO_URL', ''),
            'alt' => env('PROFILE_LOGO_ALT', 'Logo'),
        ],
        'links' => [
            'terms' => env('PROFILE_LINKS_TERMS', 'https://www.copolo.com/terms-conditions'),
            'policy' => env('PROFILE_LINKS_POLICY', 'https://www.copolo.com/privacy-policy'),
        ],
    ],
];
