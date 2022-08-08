<?php

namespace App\Services\SMS;

use Illuminate\Support\ServiceProvider;
use App\Models\ShortURLSearch;

/**
* Register our events service with Laravel
*/
class SMSServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        if(env('SMS_LOCK', false)) {
            $this->app->singleton('smsService', function($app)
            {
                // check cookie
                $uri = \Request::path();
                $uriParts = explode('/', $uri);

                $code = '';
                if($uriParts[0] === 'deal') {
                    $code = array_pop($uriParts);
                } else {
                    $sid = \Request::input('sid');
                    $sessionState = app('packageService')->getSessionData($sid);

                    if($sessionState === true) {
                        // this gets the code from user session
                        $searchParameters = app('packageService')->getParameters('');
                        $code = $searchParameters['smsCode'] ?? '';
                    }
                }
                return new SMSService($code);
            });
        }
        return false;
    }

}
