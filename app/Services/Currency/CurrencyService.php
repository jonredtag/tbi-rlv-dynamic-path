<?php
namespace App\Services\Currency;

class CurrencyService {
    protected $rates;
    protected $currency;

    function __construct($config)
    {
        $this->rates = [ "USD" => .78 ];
        $this->currency = $config['currency'];
    }

    public function convert($cost, $currency = null)
    {
        return floatval($cost) * $this->rates[$currency ?? $this->currency];
    }

    public function checkCookie()
    {
        $code = !empty($_COOKIE['currency']) ? base64_decode($_COOKIE['currency']) :  null;

        return $code;
    }

    public function getCurrency()
    {
        return $this->checkCookie() ?? $this->currency;
    }
}
