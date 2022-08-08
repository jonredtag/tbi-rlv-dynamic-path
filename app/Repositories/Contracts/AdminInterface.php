<?php

namespace App\Repositories\Contracts;

use App\Models\SnapHotel;

/**
 * An interface to set the methods in our API repositories
 */
interface AdminInterface
{
    public function cities($term);
    public function hotels($term);
    public function searchByCity(SnapHotel $hotel, $page = 1, $perPage = 50);
    public function searchByHotel(SnapHotel $hotel);
    public function updateHotel(SnapHotel $hotel, $data);
}