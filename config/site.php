<?php

return [
    "site" => env('SITE_KEY', 'demo'),

    "index" => env('SITE_INDEX', 1),

    "name" => env('SITE_NAME', 'demo'),

    "address" => env('SITE_ADDRESS', 'demo'),

    "city" => env('SITE_CITY', 'demo'),

    "province" => env('SITE_PROVINCE', 'demo'),

    "postal" => env('SITE_POSTAL', 'demo'),

    "phone" => env('SITE_PHONE', 'demo'),

    "fax" => env('SITE_FAX', 'demo'),

    "email" => env('SITE_EMAIL', 'test@email.com'),

    "htl_affiliate" => env('HOTEL_AFFILIATE', 'demo'),

    "flt_affiliate" => env('FLIGHT_AFFILIATE', 'demo'),

    "pmt_key" => env('PAYMENT_KEY', 'demo'),

    "ins_affiliate" => env('INSURANCE_AFFILIATE', 'demo'),

    "ins_provinces" => explode("|", env('INSURANCE_PROVINCES', '')),

    "pts_provider" => env('POINTS_PROVIDER', null),

    "uplift_id" => env('UPLIFT_ID', 'demo'),

    "uplift_api_key" => env('UPLIFT_API_KEY', 'demo'),

    "terms_url" => env('SITE_TERMS_URL', 'demo'),

    "email_logo" => env('MAIL_LOGO', 'demo'),

    "multi_payment" => env('HAS_MULTI_PAYMENT', true),

    "accertify_email" => env('SITE_ACCERTIFY_EMAIL', 'reservations@redtag.ca'),

    "booking_site" => env('SITE_INDEX_BOOKING', 1),

    "url" => env('MAIN_SITE', 'demo'),

    "gtm_tracking" => env('GTM_TRACKING', ''),
    "refundable_terms_link" => env('REFUNDABLE_TERMS_LINK', 'demo'),
    'member'=>env('SITE_MEMBERSHIP', 'demo'),
    
    "domain" => env('SITE_DOMAIN', 'demo'),
    "sherpa_key" => env('SHERPA_KEY', 'sherpa-elements'),

    "travel_requirements" => env('TRAVEL_REQUIREMENTS_URL', 'demo'),

    'front_page_api_key' => env('front_page_api_key', 'YAjN5sxNhwi6UT13'),
    'profile_key' => env('PROFILE_KEY', '611f3cea6b4a5821785caf90'),
];
