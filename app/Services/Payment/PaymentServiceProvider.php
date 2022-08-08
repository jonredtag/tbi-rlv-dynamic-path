<?php

namespace App\Services\Payment;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Concrete\MonerisPaymentRepository;
use App\Repositories\Concrete\AdyenPaymentRepository;
/**
* Register our events service with Laravel
*/
class PaymentServiceProvider extends ServiceProvider
{
    /**
    * Registers the service in the IoC Container
    *
    */
    public function register()
    {
        $this->app->bind('paymentService', function($app)
        {
            $config['url'] = env('PAYMENT_URL', null);
            $config['serviceid'] = config('site.pmt_key');
            $config['currency'] = config('app.currency');
            $config['vccUrl'] = config('api.paymentVcc');

            // if ($config['currency'] === 'CAD') {
                $paymentRepo = new MonerisPaymentRepository($config);
            // } else {
            //     $paymentRepo = new AdyenPaymentRepository($config);
            // }

            return new PaymentService($paymentRepo);
        });
    }

}
