<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IPBlock extends Model
{
    protected $table = "ip_blocks";
    protected $connection = 'ipLookup';
    protected $primaryKey = null;
    public $incrementing = false;

    public $timestamps = false;

    public function locationData()
    {
        return $this->BelongsTo('App\Models\IPLocation', 'LocID', 'LocId');
    }

    public function ScopeGetByIP($query, $ip)
    {

        $ipSplit = explode(".", $ip);
        if(count($ipSplit) < 4){
            $ipSplit = explode(".", "0.0.0.1");
        }
        $ipInterger = ($ipSplit[0] * 16777216) + ($ipSplit[1] * 65536) + ($ipSplit[2] * 256) + ($ipSplit[3]);

        return $query->where('startIP', '<', $ipInterger)
            ->where('endIP', '>', $ipInterger);
    }
}
