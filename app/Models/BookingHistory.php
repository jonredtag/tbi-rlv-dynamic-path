<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingHistory extends Model
{
    protected $table = "booking_history";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
