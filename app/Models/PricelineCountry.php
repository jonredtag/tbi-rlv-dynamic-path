<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelineCountry extends Model
{
    protected $table = "priceline_countries";
    protected $connection = 'priceline';
    protected $primaryKey = 'id';
    const CREATED_AT = 'creation_date_time';

}
