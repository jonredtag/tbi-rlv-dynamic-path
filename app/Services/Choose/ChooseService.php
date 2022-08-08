<?php
namespace App\Services\Choose;

use App\Models\ChooseBooking;

class ChooseService {
    protected $chooseRepo;

    function __construct($chooseRepo)
    {
        $this->chooseRepo = $chooseRepo;
    }

    public function getCarbonRate($data, $numPassengers=1)
    {
        $product = $data['product'];
        $noOfItems = 1;

        if($product == 'flight'){

            $segments = $data['segments'];
            $class = $data['class'];
            $flights = [];
            foreach ($segments as $segment) {
                foreach ($segment['legs'] as $leg) {
                    $flights[] = [
                        "origin" => $leg['departureCode'],
                        "destination" => $leg['destinationCode'],
                        "flightNumber" => $leg['flightNumber'],
                        "date" => date('Ymd', strtotime($leg['departureDatetime'])),
                    ];
                }
            }
            $noOfItems = count($flights) * $numPassengers;
            $carbonAmount = $this->chooseRepo->getChooseFootprintsByFlightSegment($flights, $class, $numPassengers);
        } else {
            $nights = $data['nights'];
            $rooms = $data['rooms'];
            $carbonAmount = $this->chooseRepo->getChooseFootprintsByHotel($nights, $rooms);
        }

        if ($carbonAmount > 0) {
            $carbonPayment = $this->chooseRepo->getChooseFootprintsAmountToPay($carbonAmount, $noOfItems, config('app.currency'));
        } else {
            $carbonPayment = ['error' => ['message' => 'No carbon amount']];
        }

        return $carbonPayment;
    }

    public function purchase($params)
    {
        $request = array();

        $stripePaymentID = $this->chooseRepo->createStripePayment($params['cc']);

        $data = null;
        if (!empty($stripePaymentID)) {
            $request = [
                "quoteId"  => $params['choose']['quoteID'],
                'customer' => [
                    'email' => $params['email'],
                    'name' => $params['name'],
                ],
                'stripePayment' => [
                    'paymentMethodId' => $stripePaymentID
                ]
            ];

            $data = $this->chooseRepo->createOrderThroughStripe($request);
        }

        $response = [
            'choose' => !empty($data) ? $data : ['billId' => 'PENDING', 'orderId' => 'PENDING'],
            'quote' => $request,
            'stripe' => $stripePaymentID,
            'currency' => $params['choose']['currency'],
            'item' => [
                "impact" => $params['choose']['impact'],
                "portfolioId" => $params['choose']['portfolioId'],
                "kilosCo2" => $params['choose']['kilosCo2'],
                "price" => $params['choose']['price'],
                // "feeFactors" => $params['choose']['feeFactors']
            ]
        ];

        return $response;
    }

    public function logBooking($data, $bookingID)
    {
        $chooseBooking = new ChooseBooking;

        $chooseBooking->choose_booking_number = $data['choose']['orderId'];
        $chooseBooking->booking_id = $bookingID;
        $chooseBooking->booking_data = json_encode($data);
        $chooseBooking->booking_status = 1;
        $chooseBooking->active = 1;

        $chooseBooking->save();
    }
}
