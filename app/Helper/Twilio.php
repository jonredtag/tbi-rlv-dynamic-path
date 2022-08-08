<?php

namespace App\Helper;

use Twilio\Rest\Client;

class Twilio
{
    private $auth_token;
    private $account_sid;
    private $messaging_sid;

    public function __construct()
    {
        $this->auth_token = getenv("TWILIO_AUTH_TOKEN");
        $this->account_sid = getenv("TWILIO_SID");
        $this->messaging_sid = getenv("TWILIO_SMS_ID");
    }

    public function sms($params)
    {
        if (
            empty($this->auth_token)
            || empty($this->account_sid)
            || empty($this->messaging_sid)
            || empty($params['phone_number'])
            || empty($params['body'])
        ) {
            return false;
        }

        $client = new Client($this->account_sid, $this->auth_token);
        $phoneField = $params['channel'] === 'whatsapp' ? 'whatsapp:' . $params['phone_number'] : $params['phone_number'];
        return $client->messages->create(
            $phoneField,
            array(
                'from' => $params['channel'] === 'whatsapp' ? 'whatsapp:' . $this->messaging_sid : $this->messaging_sid,
                'body' => $params['body'],
            )
        );
    }
}
