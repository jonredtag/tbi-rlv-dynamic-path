<?php

namespace App\Services\Admin;

use App\Models\SnapHotel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Repositories\Contracts\AdminInterface;


class AdminService
{

    public function __construct(AdminInterface $adminRepo)
    {

        $this->adminRepo = $adminRepo;
    }

    public function cities($term)
    {
        return $this->adminRepo->cities($term);
    }

    public function hotels($term)
    {
        return $this->adminRepo->hotels($term);
    }

    public function searchByCity(SnapHotel $hotel, $page = 1, $perPage = 50)
    {
        return $this->adminRepo->searchByCity($hotel, $page, $perPage);
    }

    public function searchByHotel(SnapHotel $hotel)
    {
        return $this->adminRepo->searchByHotel($hotel);
    }

    public function updateHotel(SnapHotel $hotel, $data)
    {
        return $this->adminRepo->updateHotel($hotel, $data);
    }

    public function buildCacheKey($params)
    {
        $cacheTokens = [
            'dyn',
            'adm',
            $params['module'],
            $params['type'],
            config('site.site'),
            $params['id'],
        ];
        return md5(implode('-', $cacheTokens));
    }
}
