<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestLog extends Model
{
    protected $table = "request_log";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
