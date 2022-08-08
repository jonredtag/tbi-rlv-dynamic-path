<?php

namespace App\Services\SMS;

use App\Helper\Twilio;
use App\Models\AccessTokens;
use App\Models\ShortURLSearch;
use App\Models\ShortURLHistory;
use Illuminate\Support\Facades\Cookie;

class SMSService
{
    protected $smsURL;

    public function __construct($code)
    {
        $this->smsURL = ShortURLSearch::where('code', '=', $code)->first();
    }

    public function checkCode()
    {
        $valid = $this->smsURL !== null && !empty($this->smsURL->PhoneNumber);

        if(!$valid) {
            setcookie("smscode", '', strtotime('-1 days'), '/', env('SITE_DOMAIN'));
        }

        return $valid;
    }

    public function checkCookie()
    {
        $code = $_COOKIE['smscode'] ?? null;

        $smsURL = ShortURLSearch::where('code', '=', $code)->first();

        return $smsURL !== null;
    }

    public function checkRegistered()
    {
        return $this->smsURL !== null && $this->smsURL->Registered == 1;
    }

    public function checkMobile()
    {
        return true;
    }

    public function registerDevice()
    {
        $this->smsURL->Registered = 1;
        $this->smsURL->save();

        setcookie("smscode", $this->smsURL->Code, strtotime('+365 days'), '/', env('SITE_DOMAIN'));
    }

    public function sendAuthToken(AccessTokens $accessToken)
    {
        $twilio = new Twilio();

        $message = [
            'phone_number' => $accessToken->sms->PhoneNumber,
            'body' => "Your security code is {$accessToken->Token}. Please use it to unlock the discounted rates",
            'channel' => 'sms',
        ];
        $sent = $twilio->sms($message);
    }

    public function issueAuthToken()
    {
        $this->clearAuthTokens();

        $token = SMSService::generateCode();

        $validUntil = date('Y-m-d H:i', strtotime('+30 minutes'));

        $accessToken = new AccessTokens;

        $accessToken->SmsID = $this->smsURL->ID;
        $accessToken->Token = $token;
        $accessToken->Expiry = $validUntil;

        $accessToken->save();

        $this->sendAuthToken($accessToken);

        return $this->smsURL->Code;
    }

    public function checkAuthToken($token)
    {
        $response = ["error" => ["message" => "Entered token was invalid, please try again."]];
        $now = \Carbon\Carbon::now();
        foreach($this->smsURL->tokens as $tokenRow) {
            $expiry = \Carbon\Carbon::parse($tokenRow->Expiry);

            if($tokenRow->Token === strtoupper($token)) {
                if($expiry->greaterThan($now)) {
                    $response = true;
                } else {
                    $response = ["error" => ["message" => "Entered token has expired, new token sent."]];
                    $this->issueAuthToken();
                }
                break;
            }
        }

        return $response;
    }

    public function saveHistory($params, $step)
    {
        if ($this->checkCode()) {
            $steps = [
                'search' => 0,
                'details' => 1,
                'verify' => 2,
                'confirmation' => 3,
            ];

            $history = new ShortURLHistory;

            $history->Code = $this->smsURL->Code;
            $history->Step = $steps[$step];
            $history->CheckInDate = $params['depDate'];
            $history->CheckOutDate = $params['retDate'];
            $history->Latitude = $params['destination']['latitude'];
            $history->Longitude = $params['destination']['longitude'];

            if(!empty($params['destination']['cityId'])) {
                $history->cityID = $params['destination']['cityId'];
            }

            if(!empty($params['hotelID'])) {
                $history->HotelID = $params['hotelID'];
            }

            if(!empty($params['price'])) {
                $history->Price = $params['price'];
            }

            $history->save();
        }
    }

    protected function clearAuthTokens()
    {
        foreach($this->smsURL->tokens as $token) {
            $token->delete();
        }
    }

    static function generateCode($length = 5) {
        // $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $characters = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
