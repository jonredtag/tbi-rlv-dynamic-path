<?php

namespace App\Repositories\Contracts;

Interface PaymentInterface {

    function authorize($data);
    function capture($data);
    function cancel($data);
}
