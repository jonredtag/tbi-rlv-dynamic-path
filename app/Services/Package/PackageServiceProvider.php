<?php

namespace App\Services\Package;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class PackageServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('packageService', function($app)
        {
            return new PackageService(
                $app->make('App\Repositories\Concrete\PackageRepository')
            );
        });
    }

}