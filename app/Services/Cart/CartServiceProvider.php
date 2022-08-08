<?php

namespace App\Services\Cart;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class CartServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {


        $this->app->bind('CartService', function($app)
        {
            return new CartService(
                $app->make('App\Repositories\Cart\CartRepository')
            );
        });
    }

}
