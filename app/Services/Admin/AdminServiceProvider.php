<?php

namespace App\Services\Admin;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class AdminServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('adminService', function($app)
        {
            return new AdminService(
                $app->make('App\Repositories\Concrete\AdminRepository')
            );
        });
    }

}