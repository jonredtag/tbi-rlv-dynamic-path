<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SnapHotel extends Model
{
	protected $connection = 'priceline';
    protected $table = 'snap_map';
    protected $primaryKey = 'intGlCode';
    protected $fillable = ['SequenceNumber'];
    public $timestamps = false;


    public function getRouteKeyName()
    {
        return 'intGlCode';
    }
}
