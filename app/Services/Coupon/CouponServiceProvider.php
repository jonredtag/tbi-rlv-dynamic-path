<?php

namespace App\Services\Coupon;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class CouponServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('couponService', function($app)
        {
            return new CouponService(
                $app->make('App\Repositories\Concrete\CouponRepository')
            );
        });
    }
}
