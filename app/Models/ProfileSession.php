<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileSession extends Model
{
    protected $table = "user_sessions";
    protected $connection = 'profile';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
