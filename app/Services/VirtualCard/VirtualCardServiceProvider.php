<?php

namespace App\Services\VirtualCard;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Concrete\VirtualCardRepository;
/**
* Register our events service with Laravel
*/
class VirtualCardServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('virtualCardService', function($app)
        {
            $config['vccUrl'] = config('api.paymentVcc');

            return new VirtualCardService(
                new VirtualCardRepository($config)
            );
        });
    }

}
