<?php

namespace App\Services\Profile;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Concrete\UserProfileRepository;
/**
* Register our events service with Laravel
*/
class ProfileServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('profileService', function($app)
        {
            return new ProfileService(
                new UserProfileRepository()
            );
        });
    }

}
