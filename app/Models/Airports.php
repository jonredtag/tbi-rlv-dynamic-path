<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Airports extends Model
{
    protected $table = "airport_searchEngine";

    protected $primaryKey = 'id';

    public function ScopeGetAirport($query, $code)
    {
    	return $query->where('code', $code);
    }

    public function ScopeGetByLatLong($query, $lat, $long)
    {

        return $query
            ->select('id', 'name', 'code', 'location', \DB::raw("(
                                6371 * acos(
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
            ->where('auto_fill', 1)
            ->orderBy('distance')
            ->limit(1);
    }
}
