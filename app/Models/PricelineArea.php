<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelineArea extends Model
{
    protected $table = "priceline_areas";
    protected $connection = 'priceline';
    protected $primaryKey = 'id';
    const CREATED_AT = 'creation_date_time';
}
