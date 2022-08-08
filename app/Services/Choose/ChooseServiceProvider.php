<?php

namespace App\Services\Choose;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class ChooseServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('chooseService', function($app)
        {
            return new ChooseService(
                $app->make('App\Repositories\Concrete\ChooseRepository')
            );
        });
    }
}
