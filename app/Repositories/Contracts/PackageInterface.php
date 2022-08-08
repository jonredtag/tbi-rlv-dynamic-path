<?php

namespace App\Repositories\Contracts;

/**
 * An interface to set the methods in our API repositories
 */
interface PackageInterface
{
    public function search($params, $producs);
    public function hotelDetails($sessionData, $hotelID);
}
