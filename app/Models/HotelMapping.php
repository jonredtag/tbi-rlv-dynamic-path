<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelMapping extends Model
{
    protected $table = "hotel_mapping";
    protected $connection = 'hoteladmin';
    protected $primaryKey = 'id';
    public $timestamps = false;
        
}
