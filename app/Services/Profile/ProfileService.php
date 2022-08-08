<?php

namespace App\Services\Profile;

use App\Models\ProfileSession;

class ProfileService
{
    protected $profileRepo;

    public function __construct($repo)
    {
        $this->profileRepo = $repo;
    }

    public function checkProfile()
    {
        $user = $this->profileRepo->checkProfile();

        return $user;
    }

    public function getProfileData()
    {
        $profile = $this->profileRepo->getProfileData();

        return $profile;
    }

    public function login($params)
    {
        $data = $this->profileRepo->login($params);

        return $data;
    }

    public function register($params)
    {
        $data = $this->profileRepo->register($params);

        return $data;
    }

    public function logout()
    {
        $data = $this->profileRepo->logout();

        return $data;
    }

    public function forgotPassword($params)
    {
        $data = $this->profileRepo->forgotPassword($params);

        return $data;
    }
}
