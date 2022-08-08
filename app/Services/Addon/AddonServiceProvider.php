<?php

namespace App\Services\Addon;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class AddonServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('addonService', function($app)
        {
            return new AddonService(
                $app->make('App\Repositories\Concrete\AddonRepository')
            );
        });
    }

}