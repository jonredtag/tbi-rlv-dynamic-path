<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedPromoCode extends Model
{
    protected $table = "shared_promo_code";
    protected $connection = 'deals';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    
    
}
