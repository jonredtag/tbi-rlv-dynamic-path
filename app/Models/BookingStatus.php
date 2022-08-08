<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingStatus extends Model
{
    protected $table = "booking_status";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
