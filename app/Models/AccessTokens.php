<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class AccessTokens extends Model
{
    protected $table = 'access_tokens';
    protected $connection = 'booking';
    protected $primaryKey = 'ID';
    public $timestamps = false;


    public function sms()
    {
        return $this->belongsTo(ShortURLSearch::class, 'SmsID', 'ID');
    }
}
