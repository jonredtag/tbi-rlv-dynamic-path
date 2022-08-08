<?php

namespace App\Http\Middleware;

use App\Models\ShortURLSearch;
use Closure;
use Illuminate\Support\Facades\Cookie;

class CheckVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(env('SMS_LOCK', false)) {
            if(app('smsService')->checkCode()) {
                if(!app('smsService')->checkCookie()) {

                    // check that a device is already registered
                    if(app('smsService')->checkRegistered()) {

                        // send security code
                        $code = app('smsService')->issueAuthToken();
                        return redirect(route('smsAuthorize', ['code' => $code]));
                    } else {
                        // is the device a handheld
                        if(app('smsService')->checkMobile()) {
                            // generate the verify cookie continue to results
                            app('smsService')->registerDevice();
                        } else {
                            // send security code
                            $code = app('smsService')->issueAuthToken();
                            return redirect(route('smsAuthorize', ['code' => $code]));
                        }
                    }
                }
            } else {
                return redirect(config('app.redirect_url'));
            }
        }

        return $next($request);
    }
}
