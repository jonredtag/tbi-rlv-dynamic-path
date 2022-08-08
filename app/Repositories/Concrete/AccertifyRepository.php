<?php

namespace App\Repositories\Concrete;

use App\Helper\Curl;
use App\Repositories\Contracts\AccertifyInterface;

class AccertifyRepository implements AccertifyInterface {

    private $url;

    public function __construct()
    {
        $this->url = config('accertify.url');
    }


    public function request($q)
    {
        $curl = new Curl($this->url,$q,'POST');

        $headers = array("Content-Type: application/x-www-form-urlencoded");
        $curl->setHeaders($headers);
        return $curl->request();
    }

}
