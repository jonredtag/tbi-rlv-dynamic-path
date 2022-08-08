<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $table = "payment_log";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
