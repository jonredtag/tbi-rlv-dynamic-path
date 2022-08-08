<?php

namespace App\Services\Accertify;

use App\Helper\Helpers;
use App\Models\AccertifyLog;
use App\Repositories\Contracts\AccertifyInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AccertifyService
{
    public $productHotel = 'HOTEL';
    public $productVacation = 'DYNAMIC PACKAGE';
    public $productHotelLog = 'hotel';
    public $productVacationLog = 'flightsandhotels';

    public function __construct(AccertifyInterface $accertifyRepo)
    {
        $this->accertifyRepo = $accertifyRepo;
    }

    public function getHotelProductCode()
    {
        return $this->productHotel;
    }


    public function getVacationProductCode()
    {
        return $this->productVacation;
    }


    public function translateProductCode($code)
    {
        switch($code) {
            case 'H':
                return $this->productHotel;
            break;
            case 'FH':
                return $this->productVacation;
            break;
            case 'FHC':
                return $this->productVacation;
            break;
            case 'FC':
                return $this->productVacation;
            break;
            default:
                return $this->productHotel;
            break;
        }
        return false;
    }

    public function translateProductCodeLog($code)
    {
        switch($code) {
            case 'H':
                return $this->productHotelLog;
            break;
            case 'FH':
                return $this->productVacationLog;
            break;
            case 'FHC':
                return $this->productVacationLog;
            break;
            case 'FC':
                return $this->productVacationLog;
            break;
            default:
                return $this->productHotelLog;
            break;
        }
        return false;
    }



    public function xml2array( $xmlObject, $out = array () ){
        foreach ( (array) $xmlObject as $index => $node )
        $out[$index] = ( is_object ( $node ) ) ? $this->xml2array ( $node ) : $node;
        return $out;
    }


    function format($args){
        $product = $this->translateProductCode($args['productCode']);
        $totalAmount = number_format($args['params']['costs']['total'], 2);
        $bookingNumber = !empty($args['bookingNumber']) ? $args['bookingNumber'] : '';
        $primaryPassenger = $args['params']['passengerInformation'][0];
        $currentTime = date('Y-m-d',strtotime("now")).'T'.date('H:i:s',strtotime("now"));
        $domTree =  new \DOMDocument('1.0', 'UTF-8');
        $domTree->formatOutput = true;

        $transaction = $domTree->createElement('transaction');
        $transaction = $domTree->appendChild($transaction);

        $transaction->appendChild($domTree->createElement('transactionId', $args['params']['sid']));
        $transaction->appendChild($domTree->createElement('transactionType', (!$args['preCall'] ? 'Update' : 'Order')));
        $transaction->appendChild($domTree->createElement('transactionDateTime',$currentTime));
        $transaction->appendChild($domTree->createElement('bookingModifyDateTime',$currentTime));
        $transaction->appendChild($domTree->createElement('transactionTotalAmount',$totalAmount));
        $transaction->appendChild($domTree->createElement('salesRep','WEB'));
        $transaction->appendChild($domTree->createElement('salesChannel','Retail'));
        $transaction->appendChild($domTree->createElement('businessType','B2C'));
        $transaction->appendChild($domTree->createElement('brand', env('SITE_KEY')));
        $transaction->appendChild($domTree->createElement('sourceType','Online'));

        $transaction->appendChild($domTree->createElement('browserCookie','session=743663'));
        $transaction->appendChild($domTree->createElement('ipAddress',Helpers::getClientIp()));
        if(isset($bookingNumber) && !empty($bookingNumber)){
                $transaction->appendChild($domTree->createElement('bookingNumber',$bookingNumber.($bookingNumber === 'Pending' ? date('YmdHis'): '')));
        }else{
                $transaction->appendChild($domTree->createElement('bookingNumber',''));
        }

        $transaction->appendChild($domTree->createElement('productType',$product));
        $transaction->appendChild($domTree->createElement('language',\App::getLocale()));

        $billing = $transaction->appendChild($domTree->createElement('billing',''));
        $billing->appendChild($domTree->createElement('paymentType','Credit Card'));
        $billing->appendChild($domTree->createElement('currencyCode','CAD'));

        $creditCards = $billing->appendChild($domTree->createElement('creditCards',''));
        foreach($args['params']['paymentInformation']['creditCards']  as $card){
            if(!empty($card)){
                $creditCard = $creditCards->appendChild($domTree->createElement('creditCard',''));
                $creditCard->appendChild($domTree->createElement('billingAddress-D',$card['address']));
                $creditCard->appendChild($domTree->createElement('billingCity-D',$card['city']));
                $creditCard->appendChild($domTree->createElement('billingState-D',$card['province']));
                $creditCard->appendChild($domTree->createElement('billingPostalCode-D',$card['postalZip']));
                $creditCard->appendChild($domTree->createElement('billingCountry-D',$card['country']));
                $creditCard->appendChild($domTree->createElement('billingEmailAddress-D',$primaryPassenger['email']));
                $creditCard->appendChild($domTree->createElement('billingPhoneNumber-D', str_replace("-","", $primaryPassenger['phone'])));
                $creditCard->appendChild($domTree->createElement('creditHolderName-D',$card['ccName']));
                $cardNumber = $card['ccNumber'];
                $cc = str_replace([" ", '-'],'',$cardNumber);
                $cc = substr($cc, 0, 6) . str_repeat('x', (strlen($cc) - 10)) . substr($cc, - 4);

                $cardExpiry = str_replace(['/','_'],'', trim($card['ccExpiry']));
                $month = substr($cardExpiry,0,2);
                $year =  intval(substr($cardExpiry,2, strlen($cardExpiry)-2));
                if($year < 99){
                    $year = '20'.$year;
                }
                list($cardTypeCode, $cardTypeName) = Helpers::getCardTypeAndName($cardNumber);
                $creditCard->appendChild($domTree->createElement('creditCardType-D',$cardTypeName));
                $creditCard->appendChild($domTree->createElement('creditCardNumber-D',$cc));
                $creditCard->appendChild($domTree->createElement('creditCardAuthorizedAmount-D',$card['amount']));
                $creditCard->appendChild($domTree->createElement('creditCardExpireDate-D',$month.'-'.substr($year, -2)));
                $creditCard->appendChild($domTree->createElement('creditCardExpireMonth-D',$month));
                $creditCard->appendChild($domTree->createElement('creditCardExpireYear-D',substr($year, -2)));
            }
        }
        $inauth = $transaction->appendChild($domTree->createElement('inauth',''));
        $inauth->appendChild($domTree->createElement('deviceTransactionId',\Cache::get('accertifyUniqueID')));

        $travel = $transaction->appendChild($domTree->createElement('travel',''));
        $travel->appendChild($domTree->createElement('totalPnrAmount',$totalAmount));

        // if(isset($bookingNumber) && !empty($bookingNumber)){
        //         $travel->appendChild($domTree->createElement('pnr',$bookingNumber.($bookingNumber=='PENDING' ? date('YmdHis'): '')));
        // }else{
        //         $travel->appendChild($domTree->createElement('pnr',''));
        // }

        $passengers = $travel->appendChild($domTree->createElement('passengers',''));
        foreach($args['params']['passengerInformation'] as $i=>$pax){
                $title = $pax['title'];
                switch($title){
                    case "Mr":
                        $gender = 'M';
                    break;

                    case "Ms":
                    case "Mrs":
                        $gender = 'F';
                    break;
                    default:
                        break;
                }
                $passenger = $passengers->appendChild($domTree->createElement('passenger',''));
                $dob = $pax['year'] . '-' . $pax['month'] . '-' . $pax['day'];
                $passenger->appendChild($domTree->createElement('passengerDateOfBirth',$dob));
                $passenger->appendChild($domTree->createElement('passengerGender',$gender));

                $passenger->appendChild($domTree->createElement('passengerFirstName',$pax['first']));
                $passenger->appendChild($domTree->createElement('passengerMiddleName',$pax['middle']));
                $passenger->appendChild($domTree->createElement('passengerLastName',$pax['last']));
                $passenger->appendChild($domTree->createElement('passengerNumber',$i+1));
        }

        $pnr = '';
        if (!empty($args['cartData']['flight'])) {

            $flightData = app('flightsService')->getBookingResponse($args['cartData']['flight']);

            if(isset($flightData['bookingNumber']) && !empty($flightData['bookingNumber'])){
                $pnr = $flightData['bookingNumber'];
            }


            $segments = $travel->appendChild($domTree->createElement('segments',''));
            foreach($flightData['itineraries'] as $itinerary) {
                $segment = $segments->appendChild($domTree->createElement('segment',''));
                $segment->appendChild($domTree->createElement('airlineName',$itinerary['carrier']));
                $segment->appendChild($domTree->createElement('flightNumber',$itinerary['flightNumber']));
                $depDateTime = \Carbon\Carbon::parse($itinerary['departureDateTime'])->format('Y-m-d') . 'T' . \Carbon\Carbon::parse($itinerary['departureDateTime'])->format('H:i:s');
                $arrDateTime = \Carbon\Carbon::parse($itinerary['arrivalDateTime'])->format('Y-m-d') . 'T' . \Carbon\Carbon::parse($itinerary['arrivalDateTime'])->format('H:i:s');
                $segment->appendChild($domTree->createElement('departureDateTime',$depDateTime));
                $segment->appendChild($domTree->createElement('departureCity',$itinerary['originCity']));
                $segment->appendChild($domTree->createElement('departureAirport',$itinerary['originCode']));
                $segment->appendChild($domTree->createElement('arrivalDateTime', $arrDateTime));
                $segment->appendChild($domTree->createElement('arrivalCity',$itinerary['destinationCity']));
                $segment->appendChild($domTree->createElement('arrivalAirport',$itinerary['destinationCode']));
            }
        }

        $travel->appendChild($domTree->createElement('pnr',$pnr));

        if (!empty($args['cartData']['hotel'])) {
            $hotelCartData = array_merge($args['cartData']['hotel'], ["searchParameters" => $args['userData']['searchParameters']]);
            $hotelData =  app('hotelsService')->getBookingResponse($hotelCartData);

            $segments = $travel->appendChild($domTree->createElement('hotels',''));
            $segment = $segments->appendChild($domTree->createElement('hotel',''));
            $hotelName = $domTree->createElement('hotelName');
            $hotelNameReplace = str_replace(['&'], ['and'], $hotelData['name']);
            $hotelName->appendChild($domTree->createCDATASection($hotelNameReplace));
            $segment->appendChild($hotelName);
            $segment->appendChild($domTree->createElement('hotelConfirmationCode',$hotelData['bookingNumber']));
            $segment->appendChild($domTree->createElement('hotelIdCode',$hotelData['id']));
            $addressNameReplace = str_replace(['&'], ['and'], $hotelData['address']);
            $segment->appendChild($domTree->createElement('hotelAddress', $addressNameReplace));
            $segment->appendChild($domTree->createElement('hotelAddress2',''));
            $segment->appendChild($domTree->createElement('hotelPhoneNumber',''));
            $segment->appendChild($domTree->createElement('hotelEmail',''));
            $segment->appendChild($domTree->createElement('hotelCity',$hotelData['city']));
            $segment->appendChild($domTree->createElement('hotelState',''));
            $segment->appendChild($domTree->createElement('hotelPostalCode-D',$hotelData['postalCode']));
            $numPax =  count($args['params']['passengerInformation']);

            $segment->appendChild($domTree->createElement('hotelRoomOccupancy',$numPax));
            $hotelTypeOfRoom = $domTree->createElement('hotelTypeOfRoom');
            $hotelTypeOfRoomReplace = str_replace(['&'], ['and'], $hotelData['roomType']);
            $hotelTypeOfRoom->appendChild($domTree->createCDATASection($hotelTypeOfRoomReplace));
            $segment->appendChild($hotelTypeOfRoom);
            // $segment->appendChild($domTree->createElement('hotelTypeOfRoom',$hotelData['roomType']));
            $segment->appendChild($domTree->createElement('hotelCountry-D',$hotelData['countryCode']));
            $segment->appendChild($domTree->createElement('hotelCheckInDateTime-D',$hotelData['checkIn'] . 'T11:00:00'));
            $segment->appendChild($domTree->createElement('hotelCheckOutDateTime-D',$hotelData['checkOut'] . 'T15:00:00'));
            $segment->appendChild($domTree->createElement('hotelTotalAmount',$args['productCode'] == 'H' ? $totalAmount : ''));
            $segment->appendChild($domTree->createElement('hotelComments',''));
        }

        if (!empty($args['cartData']['car'])) {
            $carData = array_merge($args['cartData']['car']['details']['row'], ["searchParameters" => $args['userData']['searchParameters']]);
            $pickupLocation = $args['cartData']['car']['verifyResult']['products']['car']['extras']['locations'][$carData['puLocId']];
            $dropOffLocation = $args['cartData']['car']['verifyResult']['products']['car']['extras']['locations'][$carData['doLocId']];

            $cars = $travel->appendChild($domTree->createElement('cars', ''));
            $car =  $cars->appendChild($domTree->createElement('car', ''));

            $car->appendChild($domTree->createElement('rentalCompany', $carData['vendorName']));
            $car->appendChild($domTree->createElement('pickUpAddress-D', $pickupLocation['row']['Ad1']));
            // $car->appendChild($domTree->createElement('pickUpState', 'IL'));
            // $car->appendChild($domTree->createElement('pickUpPostalCode', 'M1M1M1'));
            $car->appendChild($domTree->createElement('pickUpCountry-D', $pickupLocation['row']['CountryCode']));
            $car->appendChild($domTree->createElement('carCategory', $carData['class']));
            $car->appendChild($domTree->createElement('carDescription', $carData['name']));
            // $car->appendChild($domTree->createElement('pickUpPhoneNumber','555-123-1234'));
            $car->appendChild($domTree->createElement('pickUpLocation-D', $pickupLocation['row']['IATA']));
            $pickupDateFormatted = date('Y-m-d', strtotime($carData['searchParameters']['depDateCar'])) . 'T' . $carData['searchParameters']['carPickupTime'];
            $dropoffDateFormatted = date('Y-m-d', strtotime($carData['searchParameters']['retDateCar'])) . 'T' . $carData['searchParameters']['carDropoffTime'];
            $car->appendChild($domTree->createElement('pickUpDateTime-D', $pickupDateFormatted));
            $car->appendChild($domTree->createElement('returnLocation-D', $dropOffLocation['row']['IATA']));
            $car->appendChild($domTree->createElement('returnDateTime-D', $dropoffDateFormatted));
            $car->appendChild($domTree->createElement('carRentalTotalAmount', $carData['total']));
        }

        $customFields = $transaction->appendChild($domTree->createElement('customFields',''));
        $customFields->appendChild($domTree->createElement('customField1', str_replace("-","",config('site.phone'))));
        $customFields->appendChild($domTree->createElement('customField2', config('site.name')));
        $customFields->appendChild($domTree->createElement('customField3', config('site.address').' '.config('site.city').' '.config('site.province').' '.config('site.postal')));
        $customFields->appendChild($domTree->createElement('customField4', config('site.accertify_email')));

        $mstrArray = array();
        $dom =  $domTree->saveXML($domTree, LIBXML_NOEMPTYTAG);

        // file_put_contents("req-".$results['session']['id'].".xml", $dom);
        $mstrArray['reqWithCreditCard'] = $dom;

        //  encoding Creditcard from request
        $matchingElements = $domTree->getElementsByTagName('creditCard');
        $totalMatches     = $matchingElements->length;

        $elementsToDelete = array();
        for ($i = 0; $i < $totalMatches; $i++){
                $elementsToDelete[] = $matchingElements->item($i);
        }

        foreach ( $elementsToDelete as $elementToDelete ) {
                if( $elementToDelete->hasChildNodes() ) {
                foreach($elementToDelete->childNodes as $eachChildNode)
                {
                    //$eachChildNode->nodeValue = Helper::encrypt($eachChildNode->nodeValue);
                    $eachChildNode->nodeValue = md5($eachChildNode->nodeValue);

                }
            }
        }
        $dom =  $domTree->saveXML($domTree, LIBXML_NOEMPTYTAG);
        //  encoding Creditcard from request
        $mstrArray['reqWithoutCreditCard'] = $dom;
        return $mstrArray;
    }

    public function status($args)
    {
        $product = $this->translateProductCode($args['productCode']);
        $productLog = $this->translateProductCodeLog($args['productCode']);
        $sid = $args['params']['sid'];
        $request = $this->format($args);
        $q = "ProductID=$product&request=".$request['reqWithCreditCard'];

        $res = $this->accertifyRepo->request($q);

        $datatoinsert = array();
        $datatoinsert['booking_number'] = !$args['preCall'] ? $args['bookingNumber'] : '';

        $datatoinsert['uid'] = $sid;
        $datatoinsert['request'] = $request['reqWithoutCreditCard'];
        $datatoinsert['pre_call'] = (!empty($args['preCall']) && $args['preCall']) ? '1' : '0';
        $datatoinsert['product_type'] = $productLog;
        $datatoinsert['time'] = date('Y-m-d H:i:s', strtotime("now"));
        $datatoinsert['sitekey'] = env('SITE_KEY');

        if(isset($res) && !empty($res)){
            $xmlFormat = new \SimpleXMLElement($res);
            $xmlResult =  $this->xml2array($xmlFormat);
            $accertifyRs = json_encode($xmlResult);

            $datatoinsert['response'] = $accertifyRs;

            //if($args['preCall'] == 'no'){
                $accertifyRs = json_decode($accertifyRs, true);
                $scoreDetails = array('score' => $accertifyRs['totalscore'] ?? -999999, 'status' => $accertifyRs['recommendationcode'] ?? 'Bad Response');
            //}
        }

        $accertifyLog = new AccertifyLog();
        $accertifyLog->create($datatoinsert);

        return $scoreDetails;
    }

}
