<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CopoloUserBookings extends Model
{
    protected $table = "userBookings";
    protected $connection = 'profile';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
