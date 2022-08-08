<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelineCity extends Model
{
    protected $table = "priceline_cities";
    protected $connection = 'priceline';
    protected $primaryKey = 'id';
    const CREATED_AT = 'mod_date_time';
}
