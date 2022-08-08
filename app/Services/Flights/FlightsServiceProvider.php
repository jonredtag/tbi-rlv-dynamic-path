<?php

namespace App\Services\Flights;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class FlightsServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('flightsService', function($app)
        {
            return new FlightsService(
                $app->make('App\Repositories\Concrete\FlightsRepository')
            );
        });
    }

}