<?php
namespace App\Services\Crypto;

use \Illuminate\Support\Facades\Facade;

/**
*
*/
class CryptoFacade extends Facade {

    protected static function getFacadeAccessor() {
        return CryptoService::class;
    }
}
