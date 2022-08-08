<?php

namespace App\Services\Currency;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class CurrencyServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('currencyService', function($app)
        {
            return new CurrencyService(["currency" => config('app.currency')]);
        });
    }
}
