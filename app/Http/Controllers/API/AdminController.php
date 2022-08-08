<?php

namespace App\Http\Controllers\API;

use Route;
use Response;
use App\Models\SnapHotel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Cache;

class AdminController extends Controller
{
    public function __construct()
    {

    }
    public function searchCities(Request $request, $term='')
    {
        $data = app('adminService')->cities($term);

        return Response::json($data);
    }

    public function searchHotels(Request $request, $term='')
    {
        $data = app('adminService')->hotels($term);

        return Response::json($data);
    }

    public function searchByCity(SnapHotel $hotel)
    {
        $data = app('adminService')->searchByCity($hotel, request()->input('page'));
        return Response::json($data);
    }

    public function searchByHotel(SnapHotel $hotel)
    {
        $data = app('adminService')->searchByHotel($hotel);
        return Response::json($data);
    }

    public function updateHotels($searchBy, SnapHotel $hotel)
    {
        $responses = [];
        foreach (request()->input() as $params) {
            $responses[] = app('adminService')->updateHotel(SnapHotel::where('intGlCode', $params['id'])->first(), ['SequenceNumber' => $params['sequence']]);
        }

        $cacheKey = app('adminService')->buildCacheKey(['type' => $searchBy, 'module' => 'search', 'id' => $hotel->intGlCode]);
        // we have updated the sequence - so we must destroy cache to refresh and reflect new sorting
        Cache::forget($cacheKey);
        return Response::json($responses);
    }
}
