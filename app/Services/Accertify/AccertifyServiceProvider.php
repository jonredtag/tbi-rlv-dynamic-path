<?php

namespace App\Services\Accertify;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class AccertifyServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('accertifyService', function($app)
        {
            return new AccertifyService(
                $app->make('App\Repositories\Concrete\AccertifyRepository')
            );
        });
    }

}
