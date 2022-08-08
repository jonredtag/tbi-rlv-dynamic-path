<?php

namespace App\Services\Deals;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class DealsServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('dealsService', function($app)
        {
            return new DealsService(
                $app->make('App\Repositories\Concrete\DealsRepository')
            );
        });
    }

}
