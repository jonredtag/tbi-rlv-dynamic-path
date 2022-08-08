<?php

namespace App\Services\Insurance;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class InsuranceServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('insuranceService', function($app)
        {
            return new InsuranceService(
                $app->make('App\Repositories\Concrete\InsuranceRepository')
            );
        });
    }

}
