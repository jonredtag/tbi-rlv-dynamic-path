<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ShortURLHistory extends Model
{
    protected $table = 'short_urls_history';
    protected $connection = 'booking';
    protected $primaryKey = 'ID';
    public $timestamps = false;


    public function sms()
    {
        return $this->belongsTo(ShortURLSearch::class, 'Code', 'Code');
    }
}
