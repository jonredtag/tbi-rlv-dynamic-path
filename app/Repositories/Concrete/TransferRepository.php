<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Promise;
use App\Helper\Helpers;
use App\Models\HotelMapping;

class TransferRepository{
    protected $_apiClient;

    function __construct() {
        $this->baseTranferApiUrl = config('api.transfer');
        $this->ip = Helpers::getClientIp();
        $this->_apiClient = new Guzzle();
    }

    public function search($param){
        
    }
    
    public function book($params)
    {
    }
}
