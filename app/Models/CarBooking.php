<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarBooking extends Model
{
    protected $table = "car_booking";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';
}
