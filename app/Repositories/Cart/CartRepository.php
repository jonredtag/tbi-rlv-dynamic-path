<?php

namespace App\Repositories\Cart;

// use App\Events\AfterPageCreated;
use App\Repositories\Contracts\CartInterface;
use Illuminate\Support\Facades\App;
use App\Repositories\Cart\CartInstance;
use App\Repositories\Concrete\EventsRepository;
use App\Helper\MarkupHelper;
use App\Repositories\Concrete\{FlightsRepository, HotelsRepository, CarsRepository, CouponRepository};

class CartRepository implements CartInterface
{

    protected $locale;
    protected $cart = null;


    const BOOK_STEP = "book",
          VERIFY_STEP = "verify";



    public function __construct()
    {
        $this->locale = App::getLocale();

    }

    function initCart($cartId = null){
        $this->cart = new CartInstance($cartId);
        // init or remove cart data
        $this->cart->updateCart(['costs' => []]);

        return $this->cart->getCartId();
    }

    function setCart($cartId){
        $this->cart = new CartInstance($cartId);
    }

    public function addItem($data){
        $productData = false;
        // get cart data
        $cartData = $this->cart->getCartData();

        // update cart
        if($data['type'] == 'flight'){
            $productRepo = new FlightsRepository();
            $productData = $productRepo->getSelectedResult($data);
        } elseif($data['type'] == 'hotel'){
            $productRepo = new HotelsRepository();
            $productData = $productRepo->getSelectedResult($data);
        } elseif($data['type'] == 'car') {
            $productRepo = new CarsRepository();
            $productData = $productRepo->details($data);
        } else {
            $productData = $data['content'];
        }

        if($productData){
            $cartData[$data['type']] = $productData;
            $cartData[$data['type']]['step'] = "search";
            $this->cart->updateCart($cartData);
        }

        return $productData;
    }

    public function removeItem($item)
    {
        $cartData = $this->cart->getCartData();

        if(!empty($cartData[$item])) {
            unset($cartData[$item]);

            $this->cart->updateCart($cartData);
        }
        return $cartData;
    }
    /**
    *
    * Get the data in the Cart.
    *
    * returns false eif the cart is not initialized
    */
  	public function getDetails(){
        if(is_null($this->cart))
            return false;

        return $this->cart->getCartData();
    }

    public function verify(){
        $cartData = $this->cart->getCartData();
        $error = [];
        $isError = false;
        $markupHelper = new MarkupHelper($this->cart->getCartId());
        $cost = 0;
        if(isset($cartData['flight']) && empty($cartData['flight']['verifyResult'])){
            $productRepo = new FlightsRepository();
            $verifyParams = [
                'sessionId' => $cartData['flight']['sessionId'],
                'resultId' => $cartData['flight']['resultId'],
                'rowId' => $cartData['flight']['id'],
                'refundable' => $cartData['flight']['refundable'],
            ];
            $verifyData = $productRepo->verify($verifyParams);
            $termsData = $productRepo->terms($verifyParams);
            $isError = (isset($verifyData['error']));
            if($isError) {                                
                $error = [
                    "error" => [
                        "code" => "V1", 
                        "message" => "Unfortunately you flight order was unable to be processed. Please go back and reselect your products.", 
                        "product" => 'flights'
                    ]
                ];

            } else {
                if(config('app.currency') !== 'CAD') {
                    $verifyData = app('flightsService')->verifyCurrencyConversion($verifyData);
                }
                $verifyData = $markupHelper->applyFlightsMarkupVerify($verifyData);
                $cartData['costs']['total']['flight'] = $verifyData['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['total'];
                $cartData['costs']['per']['flight'] = $verifyData['data']['cartResult']['products']['flight']['rateInfo']['pricingInfo']['passengers']['ADT']['totalFare'];
            }

            $cartData['flight']['verifyResult'] = ($isError)?[]:$verifyData['data']['cartResult'];
            $cartData['flight']['step'] = self::VERIFY_STEP;
            $cartData['flight']['terms'] = $termsData;
            $cartData['vfTimeStamp'] =  time();
        }

        if (isset($cartData['hotel']) && !$isError && empty($cartData['hotel']['verifyResult'])) {
            $productRepo = new HotelsRepository();
            $verifyParams = [
                'sessionId' => $cartData['hotel']['sessionId'],
                'roomIndex' => $cartData['hotel']['roomIndex'],
                'resultId' => $cartData['hotel']['resultId'],
                'lang' => \App::getLocale(),
                'rateIndex' => 0
            ];
            $verifyData = $productRepo->verify($verifyParams);
            $isError = (isset($verifyData['error']));
            if($isError) {
                $error = [
                    "error" => 
                    [
                        "code" => "V1", 
                        "message" => "Unfortunately you hotel order was unable to be processed. Please go back and reselect your products.", 
                        "product" => 'hotels'
                    ]
                ];
            } else {
                $verifyData = $markupHelper->applyHotelsMarkupVerify($verifyData);
                $cartData['costs']['total']['hotel'] = $verifyData['data']['cartResult']['products']['hotel']['roomResults']['rows'][0]['rateInfo'][0]['pricingInfo'][0]['total'];
                $travellers = 0;
                foreach($verifyData['data']['cartResult']['products']['extra']['request']['rooms'] as $occupancy) {
                    $travellers += $occupancy['adults'] + $occupancy['children'];
                }
                $cartData['costs']['per']['hotel'] = $cartData['costs']['total']['hotel'] / $travellers;
            }
            $cartData['hotel']['verifyResult'] = ($isError)?[]:$verifyData['data']['cartResult'];
            $cartData['hotel']['step'] = self::VERIFY_STEP;
            $cartData['vfTimeStamp'] =  time();
        }

        if(isset($cartData['car']) && empty($cartData['car']['verifyResult']) && !$isError) {
            $productRepo = new CarsRepository();
            $verifyParams = [
                'sessionId' => $cartData['car']['session']['id'],
                'rateIndex' => $cartData['car']['rateIndex'],
                'code' => $cartData['car']['key'],
            ];
            $verifyData = $productRepo->verify($verifyParams);
            $isError = (isset($verifyData['error']));
            if($isError) {
                $error = [
                    "error" => 
                    [
                        "code" => "V1",
                        "message" => "Unfortunately you car order was unable to be processed. Please go back and reselect your products.", 
                        "product" => 'cars'
                    ]
                ];
            } else {
                // $verifyData = $markupHelper->applyHotelsMarkupVerify($verifyData);
                $cost += $verifyData['cartResult']['details']['rates'][0]['total'];
            }

            $cartData['car']['verifyResult'] = ($isError)?[]:$verifyData['cartResult'];
            $cartData['car']['step'] = self::VERIFY_STEP;
        }

        if (isset($cartData['coupon']) && !$isError && empty($cartData['coupon']['verifyResult'])) {
            $productRepo = new CouponRepository();
            $cost = 0;
            foreach ($cartData['costs']['total'] as $key => $value) {
                $cost += $value;
            }
            $costPer = 0;
            foreach ($cartData['costs']['per'] as $key => $value) {
                $costPer += $value;
            }
            $verifyData = $productRepo->checkCode(["couponCode" => $cartData['coupon']['code'], 'validate' => 'true', 'cost' => $cost, 'costPer' => $costPer]);
            $isError = (isset($verifyData['error']));
            $cartData['coupon']['verifyResult'] = $isError ? $verifyData : $verifyData['coupon'];
            $cartData['coupon']['step'] = self::VERIFY_STEP;
            $cartData['coupon']['status'] = $isError ? "error" : "success";
        }
        $this->cart->updateCart($cartData);
        return empty($error) ? $cartData : $error;
    }

    public function update($data)
    {
        $this->cart->updateCart($data);
    }
}
