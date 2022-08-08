<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = "booking";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';

    public function emailData()
    {
    	return $this->hasOne('App\Models\EmailData', 'booking_id', 'id');
    }

    public function Status()
    {
    	return $this->belongsTo('App\Models\BookingStatus', 'booking_status');
    }
}
