<?php

namespace App\Services\Payment;

use App\Repositories\Contracts\PaymentInterface;
use App\Models\PaymentLog;

class PaymentService
{
    protected $paymentRepo;

    public function __construct(PaymentInterface $paymentRepo)
    {
        $this->paymentRepo = $paymentRepo;
    }

    public function authorize($requestData) {
        return $this->paymentRepo->authorize($requestData);
    }

    public function capture($requestData) {
        return $this->paymentRepo->capture($requestData);
    }

    public function cancel($requestData) {
        return $this->paymentRepo->cancel($requestData);
    }

    public function purchase($requestData) {
        $time = date("Hi");
        $bookingnum = $requestData['bookingnum'];
        $requestData['ttsquoteid'] = $time . '-' . $bookingnum;
        $requestData['bookingnum'] = "B" . $time . '-' . $bookingnum;
        $requestData['currtype'] = 'CAD';
        $requestData['purchase'] = '1';

        $response = $this->paymentRepo->request($requestData);

        $this->logTransaction(__FUNCTION__, $requestData, $response, $bookingnum);
    }

    public function refund($requestData) {
        $time = date("Hi");
        $bookingnum = $requestData['bookingnum'];
        $requestData['ttsquoteid'] = $time . '-' . $bookingnum;
        $requestData['bookingnum'] = "B" . $time . '-' . $bookingnum;
        $requestData['currtype'] = 'CAD';
        $requestData['refund'] = '1';

        $response = $this->paymentRepo->request($requestData);

        $this->logTransaction(__FUNCTION__, $requestData, $response, $bookingnum);
    }

    public function accessLog($requestData)
    {
        $data = PaymentLog::where('booking_id', $requestData['bookingID'])->get();
        $response = [];
        foreach ($data as $row) {
            $request = \Crypto::decrypt($row->request);

            $response[] = [
                'request' => json_decode($request, true),
                'response' => htmlspecialchars($row->response),
                'time' => date('Y-m-d H:i:s', strtotime($row->timestamp)),
            ];
        }

        return $response;
    }
}
