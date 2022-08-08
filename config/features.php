<?php

return [
    'deposit' => env('REFUNDABLEPATH', false),
    'deposit_date' => env('REFUNDABLEDATE', 45),
    'default_transfer_dest'=> explode(',', env('DEFAULT_TRANSFER_DEST','CUN,PVR,SJD')),
    'default_transfer_price'=>json_decode(env('DEFAULT_TRANSFER_PRICE','{"CUN":["34","17"],"PVR":["78","0"],"SJD":["69","0"]}'),TRUE),
    'choose' => env('CHOOSE_ENABLE', false),
    'addon_enable'=>env('ADDON_ENABLE', false),
    'transfer' => env('TRANSFER_ENABLE', false),
    'activity' => env('ACTIVITY_ENABLE', false),
    'manulife' => env("MANULIFE_ENABLE", true),
    'profile' => env('PROFILE_ENABLE', false),
];
