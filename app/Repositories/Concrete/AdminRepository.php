<?php

namespace App\Repositories\Concrete;

use App\Models\SnapHotel;
use App\Repositories\Contracts\AdminInterface;
use Cache;

class AdminRepository implements AdminInterface
{
    public function cities($term)
    {
        $cacheKey = app('adminService')->buildCacheKey(['type' => 'cities', 'module' => 'autocomplete', 'id' => $term]);
        if (Cache::has($cacheKey)) {
            if (!empty($cached = cache($cacheKey))) {
                return $cached;
            }
        }
        if (strlen($term) < 1) {
            return [];
        }
        $hotels = SnapHotel::where('CityName', 'LIKE', "%$term%")->groupBy('CityName')->get();
        $response = [];
        foreach ($hotels as $index => $hotel) {
            $response[] = [
                'category' => 'city',
                'text' => $hotel->CityName,
                'value' => $hotel->intGlCode,
                'text2' => $hotel->CountryName,
                'id' => $hotel->intGlCode,
                'index' => $index,
            ];
        }
        Cache::put($cacheKey, $response, 1800);
        return $response;
    }

    public function hotels($term)
    {
        $cacheKey = app('adminService')->buildCacheKey(['type' => 'hotels', 'module' => 'autocomplete', 'id' => $term]);
        if (Cache::has($cacheKey)) {
            if (!empty($cached = cache($cacheKey))) {
                return $cached;
            }
        }
        if (strlen($term) < 1) {
            return [];
        }
        $hotels = SnapHotel::where('DisplayName', 'LIKE', "%$term%")->orderBy('SequenceNumber')->limit(20)->get();
        $response = [];
        foreach ($hotels as $index => $hotel) {
            $response[] = [
                'category' => 'hotel',
                'text' => $hotel->DisplayName,
                'value' => $hotel->intGlCode,
                'text2' => $hotel->Address,
                'id' => 'hotel-' . $hotel->intGlCode,
                'index' => $index,
            ];
        }
        Cache::put($cacheKey, $response, 1800);
        return $response;
    }

    public function updateHotel(SnapHotel $hotel, $data)
    {
        return $hotel->update($data);
    }


    public function searchByCity(SnapHotel $hotel, $page = 1, $perPage = 100)
    {
        $cacheKey = app('adminService')->buildCacheKey(['type' => 'city', 'module' => "search_$page", 'id' => \Str::slug($hotel->CityName) . '_' . $hotel->CountryCode]);
        Cache::forget($cacheKey);
        if (Cache::has($cacheKey)) {
            if (!empty($cached = cache($cacheKey))) {
                return $cached;
            }
        }
        $input = request()->input();
        $hotels = SnapHotel::where('CityName', $hotel->CityName)->where('CountryCode', $hotel->CountryCode)->orderBy('SequenceNumber')->paginate($perPage);
        Cache::put($cacheKey, $hotels, 1800);
        return $hotels;
    }


    public function searchByHotel(SnapHotel $hotel)
    {
        $cacheKey = app('adminService')->buildCacheKey(['type' => 'hotel', 'module' => 'search', 'id' => $hotel->intGlCode]);
        if (Cache::has($cacheKey)) {
            if (!empty($cached = cache($cacheKey))) {
                return $cached;
            }
        }

        $response = [
            'data' => collect([$hotel]),
        ];
        Cache::put($cacheKey, $response, 1800);
        return $response;
    }
}
