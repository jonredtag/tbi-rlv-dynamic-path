<?php

namespace App\Repositories\Cart;

use Cache;

class CartInstance
{

    private $cartId;
    const DEFAULT_EXPIRY = 1800;
    const CACHE_PREFIX = "BKST-";

    public function __construct($cartId = null)
    {
        if (is_null($cartId)) {
            $this->cartId = self::CACHE_PREFIX . md5((uniqid(rand(), true)) . time());
        } else {
            $this->cartId = $cartId;
        }
    }

    public function getCartId()
    {
        return $this->cartId;
    }

    public function getCartData()
    {
        return (Cache::has($this->cartId)) ?
        Cache::get($this->cartId)
        : false;
    }

    public function updateCart($data, $seconds = false)
    {
        if ($seconds == false) {
            $seconds = self::DEFAULT_EXPIRY;
        }

        $data['cartId'] = $this->cartId;
        Cache::put($this->cartId, $data, (int) $seconds);
    }
}
