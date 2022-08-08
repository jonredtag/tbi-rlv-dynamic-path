<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiviniaLogs extends Model
{
    protected $table = "divinia_logs";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
