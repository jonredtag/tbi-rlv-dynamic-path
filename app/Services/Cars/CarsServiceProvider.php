<?php

namespace App\Services\Cars;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class CarsServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('carsService', function($app)
        {
            return new CarsService(
                $app->make('App\Repositories\Concrete\CarsRepository')
            );
        });
    }
}
