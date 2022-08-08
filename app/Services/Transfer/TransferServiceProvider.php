<?php

namespace App\Services\Transfer;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class TransferServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('transferService', function($app)
        {
            return new TransferService(
                $app->make('App\Repositories\Concrete\TransferRepository')
            );
        });
    }

}