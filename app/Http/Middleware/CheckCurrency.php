<?php

namespace App\Http\Middleware;

use Closure;

class CheckCurrency
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
        $curCode = $request->input('cur');

        $code = '';
        $sid = $request->input('sid');
        if(config('app.env') !== 'production' && $curCode !== null) {
            $code = $curCode;
        }

        if (!empty($code)) {
            config(['app.currency' => $code]);
        }

        return $next($request);
    }
}
