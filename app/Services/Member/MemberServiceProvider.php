<?php

namespace App\Services\Member;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Concrete\HsbcMemberRepository;
use App\Repositories\Concrete\CibcMemberRepository;

/**
* Register our events service with Laravel
*/
class MemberServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->singleton('memberService', function($app)
        {
            $memberRepo = null;
            $config =  json_decode(env('MEMBER_API' ,'{}'),true);
            if (env("SITE_KEY") ==='hsbc') {
                //$memberRepo = new HsbcMemberRepository($config);
                $memberRepo = new CibcMemberRepository($config); 
             } else {
                $memberRepo = new CibcMemberRepository($config); 
             }
             return new MemberService($memberRepo);
        });
    }
}
