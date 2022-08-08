<?php

namespace App\Http\Controllers;

use App\Helper\Twilio;
use App\Models\ShortUrl;
use Illuminate\Http\Request;

class SmsController extends Controller
{

    public function deal()
    {
        $searchParameters = request()->all();
        return view('pages.hotel-deal', compact('searchParameters'));
    }

    public function send()
    {
        $params = parse_url(request()->input('url'));
        parse_str($params['query'], $query);       
        $phone_number = request()->input('phone_number');
        $json = json_encode($query);
        $shortUrl = ShortUrl::create(
            [
                'slug' => md5($json . $phone_number . time()),
                'json' => $json,
            ]
        );



        $twilio = new Twilio();
        $message = [
            'phone_number' => $phone_number,
            'body' => 'Get this awesome hotel deal! ' . route('hotelDeal', ['slug' => $shortUrl->slug]),
        ];
        $sent = $twilio->sms($message);

        return ['success' => 1, 'message' => 'SMS Sent!'];


    }
}
