<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelAutocomplete extends Model
{
    protected $table = "hotel_searchEngine";

    protected $primaryKey = 'id';
}
