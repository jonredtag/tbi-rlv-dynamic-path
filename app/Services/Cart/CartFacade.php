<?php
namespace App\Services\Cart;

use \Illuminate\Support\Facades\Facade;

/**
*
*/
class CartFacade extends Facade {

    protected static function getFacadeAccessor() { return 'CartService'; }
}
