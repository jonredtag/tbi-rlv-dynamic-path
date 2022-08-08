<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsuranceBooking extends Model
{
    protected $table = "insurance_booking";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';
}
