<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefundableFlights extends Model
{
    protected $table = "BlocBSM";
    protected $connection = 'trustyou';
    protected $primaryKey = 'gpId';
    public $timestamps = false;

}
