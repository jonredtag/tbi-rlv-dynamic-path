<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::post('/', 'BookingController@buildPackage');
Route::get('/search', 'BookingController@buildPackage');

Route::middleware('verify')->prefix('hotel')->group(function () {
    Route::get('/search', 'BookingController@hotelResults')->name('hotelSearch');
    Route::get('/details/{hotelID}', 'BookingController@hotelDetails')->name('hotelSelect');
    Route::get('/deal/{slug?}', 'BookingController@hotelDeal')->name('hotelDeal');
});

Route::middleware('verify')->prefix('flight')->group(function () {
    Route::get('search', 'BookingController@flightResults')->name('flightSearch');
    Route::post('setDefault', 'API\FlightsController@setDefault');
});

Route::prefix('car')->group(function() {
    Route::get('search', 'BookingController@carResults')->name('carSearch');
});

Route::middleware('verify')->prefix('activity')->group(function () {
    Route::get('/search', 'BookingController@activityResults')->name('activitySearch');
    Route::get('/details/{id}', 'BookingController@activityDetails')->name('activitySelect');
});

Route::get('deal/hotel', 'MarketingController@hotelDetailsSearch');

Route::get('/deal/authorize/{code}', 'MarketingController@register')->name('smsAuthorize');
Route::post('/deal/checktoken/{code}', 'MarketingController@checkAuthToken')->name('smsCheckToken');
Route::post('/deal/resendtoken/{code}', 'MarketingController@resendAuthToken');
Route::get('/deal/{code}', 'MarketingController@getDeal')->name('marketDeal')->middleware('verify');

Route::prefix('emails')->group(function () {
    Route::get('/confirmation/{bookingId}/{code}', 'EmailController@confirmationEmail');
    Route::get('/activityVoucher/{bookingId}/{code}', 'EmailController@activityVoucher');
});

Route::get('/flight-hotel-checkout', 'BookingController@checkout')->name('flight-hotel-checkout')->middleware('verify');
Route::get('/hotel-checkout', 'BookingController@checkout')->name('hotel-checkout')->middleware('verify');
Route::get('/checkout', 'BookingController@checkout')->name('checkout')->middleware('verify');
Route::get('/review', 'BookingController@review')->name('review')->middleware('verify');

Route::get('/airline-terms', 'BookingController@airlineterms')->name('terms');

Route::get('/confirmation', 'BookingController@confirmation')->name('confirmation');
Route::get('/hotel-confirmation', 'BookingController@confirmation')->name('hotel-confirmation');
Route::get('/flight-hotel-confirmation', 'BookingController@confirmation')->name('flight-hotel-confirmation');
Route::get('/confirmation-test/{testId?}', 'BookingController@confirmation2')->name('confirmation2');

Route::get('/deeplink', 'BookingController@deeplink');
if(Config::get('app.env') !== 'production'){
    Route::get('/{wildcard?}', 'BookingController@index'); // needs to be last or bad things can happen
} else {
    Route::get('/', function() {
        return redirect(config('app.redirect_url'));
    });
}

Route::prefix('backend')->group(function () {
    Route::get('/hotels', 'BackendController@hotels');
});
