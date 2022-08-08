<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelinePoi extends Model
{
    protected $table = "priceline_poi";
    protected $connection = 'priceline';
    protected $primaryKey = 'id';
    const CREATED_AT = 'creation_date_time';

    public function ScopeGetByLatLong($query, $lat, $long, $radius)
    {   // change 6371 to 3959 for mile
        return $query
            ->select('id', 'latitude', 'longitude', 'poi_name AS name', \DB::raw("(
                                3959 * acos(
                                    cos(
                                        radians('$lat')
                                    ) * cos(
                                        radians( latitude )
                                    ) * cos(
                                        radians( longitude ) - radians('$long')
                                    ) + sin(
                                        radians('$lat')
                                    ) * sin(
                                        radians( latitude )
                                    )
                                )
                            ) AS distance"))
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->having('distance', '<', $radius)
            ->orderBy('distance')
            ->limit(25);
    }
}
