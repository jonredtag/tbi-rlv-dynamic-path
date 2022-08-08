<?php

namespace App\Http\Controllers;

use Events;
use Illuminate\Http\Request;
use App\Models\EmailData;

class EmailController extends Controller
{
    public function __construct()
    {

    }

    public function confirmationEmail(Request $request, $bookingId, $code)
    {
        if (!empty($bookingId) && !empty($code)) {
            $emailData = app('packageService')->getConfrmationData($bookingId, $code);
            return view('emails.confirmation', compact('emailData'));
        }
    }
    
   
  
     public function activityVoucher(Request $request, $bookingId, $code)
    {
        if (!empty($bookingId) && !empty($code)) {
            $data = app('activityService')->getBookingData($bookingId, $code);
            if(!empty($data)){
                 $voucherHtml = view('emails.voucher')->render();
                $bookingInfo = json_decode($data);

                //Collect passenger numbers and ages.
                $adultNumber = 0;
                $childrenNumber = 0;
                $childrenAges = [];
                foreach ($bookingInfo->booking->activities[0]->paxes as $pax) 
                {
                    if ($pax->paxType == "AD")
                    {
                        $adultNumber++;
                    }
                    else
                    {
                        $childrenNumber++;
                        $childrenAges[] = $pax->age;
                    }
                }
                $remarks = str_ireplace("\n", "<br/>", $bookingInfo->booking->activities[0]->comments[0]->text);
                $remarks = str_ireplace("\t", "", $remarks);
               // $voucherHtml = file_get_contents('voucherTemplate.html');    
                $voucherHtml = str_ireplace("##Reference##", $bookingInfo->booking->activities[0]->activityReference, $voucherHtml);
                $voucherHtml = str_ireplace("##ActivityName##", $bookingInfo->booking->activities[0]->name, $voucherHtml);
                $voucherHtml = str_ireplace("##HolderName##", $bookingInfo->booking->holder->name." ".$bookingInfo->booking->holder->surname, $voucherHtml);
                $voucherHtml = str_ireplace("##BookingDate##", date("m/d/Y", strtotime($bookingInfo->booking->creationDate)), $voucherHtml);
                $voucherHtml = str_ireplace("##AgencyNumber##", $bookingInfo->booking->agency->code, $voucherHtml);
                $voucherHtml = str_ireplace("##DateFrom##", date("m/d/Y", strtotime($bookingInfo->booking->activities[0]->dateFrom)), $voucherHtml);
                $voucherHtml = str_ireplace("##DateTo##", date("m/d/Y", strtotime($bookingInfo->booking->activities[0]->dateTo)), $voucherHtml);
                $voucherHtml = str_ireplace("##ModalityName##", $bookingInfo->booking->activities[0]->modality->name, $voucherHtml);
                $voucherHtml = str_ireplace("##AdultNumber##", $adultNumber, $voucherHtml);
                $voucherHtml = str_ireplace("##ChildrenNumber##", $childrenNumber, $voucherHtml);
                $voucherHtml = str_ireplace("##ChildrenAges##", empty($childrenAges) ? "" : implode(", ", $childrenAges), $voucherHtml);
                $voucherHtml = str_ireplace("##Remarks##", $remarks, $voucherHtml);
                $voucherHtml = str_ireplace("##ProviderInfo##", $bookingInfo->booking->activities[0]->providerInformation->name, $voucherHtml);
                $voucherHtml = str_ireplace("##SupplierName##", $bookingInfo->booking->activities[0]->supplier->name, $voucherHtml);
                $voucherHtml = str_ireplace("##SupplierVatNumber##", $bookingInfo->booking->activities[0]->supplier->vatNumber, $voucherHtml);
                $voucherHtml = str_ireplace("##CurrentDate##", date("m/d/Y", strtotime("now")), $voucherHtml);
                return $voucherHtml;
            }             
        }
    }
    
}
