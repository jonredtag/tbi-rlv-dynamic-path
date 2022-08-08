<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IPLocation extends Model
{
    protected $table = "ip_location";
    protected $connection = 'ipLookup';

    protected $primaryKey = null;
    public $incrementing = false;

    public $timestamps = false;
}
