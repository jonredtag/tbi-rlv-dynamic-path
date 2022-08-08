<?php

namespace App\Repositories\Contracts;

/**
 * An interface to set the methods in our API repositories
 */
interface MyAccountInterface {

    public function myprofile($params);

    public function updatePassword($params);

    public function updateEmailPreferences($params);

    public function getPersonalInfo();

    public function updatePersonalInfo($params);

    public function addTraveler($params);

    public function getTraveler();

    public function deleteTraveler($params);

    public function getUser();

    public function getUserInfo();
    
    public function updateLocation($params);

    // public function profileImage($params);

    public function getMyTrip();
}
