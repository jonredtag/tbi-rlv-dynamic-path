<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailData extends Model
{
    protected $table = "email_data";
    protected $connection = 'booking';
    protected $primaryKey = 'id';
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';
}
