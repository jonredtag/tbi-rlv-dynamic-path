<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortURLSearch extends Model
{
    protected $table = "short_urls";
    protected $connection = 'booking';
    protected $primaryKey = 'ID';
    public $timestamps = false;


    public function tokens()
    {
    	return $this->hasMany(AccessTokens::class, 'SmsID', 'ID');
    }
}
