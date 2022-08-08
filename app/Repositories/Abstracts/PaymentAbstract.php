<?php

namespace App\Repositories\Abstracts;

use App\Models\PaymentLog;

abstract class PaymentAbstract {
    protected function logTransaction($transType, $requestData, $responseData, $bookingNumber) {
        $log = new PaymentLog();

        $log->booking_id = $bookingNumber;
        $log->trans_type = $transType;
        $log->request = \Crypto::encrypt((is_array($requestData) ? json_encode($requestData) : $requestData));
        $log->response = (is_array($responseData) ? json_encode($responseData) : $responseData->asXML());

        $log->save();
    }
}
