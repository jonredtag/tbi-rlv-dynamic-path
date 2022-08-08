<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChooseBooking extends Model
{
    protected $table = "choose_booking";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';

}
