<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProductWatch extends Model
{
    protected $table = "user_product_watch";
    protected $connection = 'booking';
    protected $primaryKey = 'ID';
    public $timestamps = false;
}
