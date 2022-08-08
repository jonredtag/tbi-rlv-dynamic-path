<?php

namespace App\Services\Activity;

use Illuminate\Support\ServiceProvider;

/**
* Register our events service with Laravel
*/
class ActivityServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('activityService', function($app)
        {
            return new ActivityService(
                $app->make('App\Repositories\Concrete\ActivityRepository')
            );
        });
    }

}