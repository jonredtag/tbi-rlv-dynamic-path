<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelineAirport extends Model
{
    protected $table = "priceline_airport";
    protected $connection = 'priceline';
    protected $primaryKey = 'id';
    const CREATED_AT = 'creation_date_time';

}
