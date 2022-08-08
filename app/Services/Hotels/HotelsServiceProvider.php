<?php

namespace App\Services\Hotels;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class HotelsServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('hotelsService', function($app)
        {
            return new HotelsService(
                $app->make('App\Repositories\Concrete\HotelsRepository')
            );
        });
    }

}