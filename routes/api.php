<?php

use Illuminate\Http\Request;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use App\Http\Controllers\MyAccountController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('hotel')->group(function() {
	Route::get('search', 'API\HotelsController@search');
	Route::get('details', 'API\HotelsController@details');
	Route::get('filter', 'API\HotelsController@filter');
	Route::get('paginate', 'API\HotelsController@paginate');
	Route::get('autocomplete/{term?}', 'API\HotelsController@autocomplete');
	Route::post('add', 'API\HotelsController@add');
	Route::post('update-engine', 'API\HotelsController@updateEngine');
	Route::post('sms', 'SmsController@send');
	Route::get('topicReviews', 'API\HotelsController@getTopicReviews');
});

Route::prefix('coupon')->group(function() {
	Route::get('checkCode', 'API\CouponController@checkCode');
	Route::get('verify-coupon', 'API\CouponController@VerifyCoupon');
	Route::post('remove-coupon', 'API\CouponController@removeCoupon');
	Route::get('remove-coupon', 'API\CouponController@removeCoupon');
});

Route::prefix('flight')->group(function() {
	Route::get('filter', 'API\FlightsController@filter');
	Route::get('paginate', 'API\FlightsController@paginate');
	Route::get('search', 'API\FlightsController@search');
	Route::get('details', 'API\FlightsController@details');
	Route::get('autocomplete/{term?}', 'API\FlightsController@autocomplete');
	Route::post('update-engine', 'API\FlightsController@updateEngine');
	Route::post('add/{id}', 'API\FlightsController@addFlight');
});

Route::prefix('car')->group(function() {
	Route::get('filter', 'API\CarsController@filter');
	Route::get('paginate', 'API\CarsController@paginate');
	Route::get('search', 'API\CarsController@search');
	Route::get('terms', 'API\CarsController@terms');
	Route::get('details', 'API\CarsController@details');
	Route::post('add', 'API\CarsController@addCar');
});

Route::prefix('dynamic')->group(function() {
	Route::get('footprint', 'API\DynamicController@footprint');
	Route::get('autocomplete/{term?}', 'API\DynamicController@autocomplete');
	Route::get('autosuggest/{term?}', 'API\DynamicController@autosuggest');
	Route::get('flightDates', 'API\DynamicController@flightDates');
	Route::get('update', 'API\DynamicController@updateSearch');
	Route::get('deletepackagecache', 'API\DynamicController@deletePackageCache');
	Route::get('search', 'API\DynamicController@search');
	Route::get('details', 'API\DynamicController@details');
	Route::post('add-product', 'API\DynamicController@add');
	Route::get('verify', 'API\DynamicController@verify');
	Route::post('book', 'API\DynamicController@book');
});


Route::prefix('admin')->group(function() {
	Route::get('cities/{term?}', 'API\AdminController@searchCities');
	Route::get('hotels/{term?}', 'API\AdminController@searchHotels');
	Route::get('search/city/{hotel}', 'API\AdminController@searchByCity');
	Route::get('search/hotel/{hotel}', 'API\AdminController@searchByHotel');
	Route::post('update/{searchBy}/{hotel}', 'API\AdminController@updateHotels');
});

Route::prefix('checkout')->group(function() {
	Route::post('remove',  'API\CheckoutController@removeProduct');
	Route::get('validation', 'API\CheckoutController@validation');
        	Route::get('get-package-vfres', 'API\CheckoutController@getVerifiedPackage');
        	Route::post('build-package', 'API\CheckoutController@buildPackage');
	Route::post('book', 'API\CheckoutController@book');
	Route::get('getQuote', 'API\CheckoutController@getInsurance');
});

Route::prefix('profile')->group(function() {
	Route::post('addWatch', 'API\ProfileController@addWatch');
	Route::get('getList/{hash}/{email}', 'API\ProfileController@getList');
	Route::post('removeWatch/{hash}/{id}', 'API\ProfileController@removeWatch');
	Route::get('discoverWatcher', 'API\ProfileController@discoverWatcher');
	Route::get('getWatchListhotels', 'API\ProfileController@getWatchListHotels');
	Route::post('login', 'API\ProfileController@login');
	Route::post('logout', 'API\ProfileController@logout');
	Route::post('register', 'API\ProfileController@register');
	Route::post('forgotPassword', 'API\ProfileController@forgot');
	Route::get('user', 'API\ProfileController@user');
});


Route::prefix('myAccount')->group(function() {    
	Route::post('profileImage', [MyAccountController::class,'profileImage']);
	Route::post('updateLocation', [MyAccountController::class, 'updateLocation']);
	Route::post('updatePassword', [MyAccountController::class, 'updatePassword']);
	Route::post('updateEmailPreferences', [MyAccountController::class, 'updateEmailPreferences']);
	Route::post('addTraveler', [MyAccountController::class, 'addTraveler']);
	Route::get('getPersonalInfo', [MyAccountController::class, 'getPersonalInfo']);
	Route::post('updatePersonalInfo', [MyAccountController::class, 'updatePersonalInfo']);
	Route::get('getTraveler', [MyAccountController::class, 'getTraveler']);
	Route::get('getUser', [MyAccountController::class, 'getUser']);
	Route::get('getUserInfo', [MyAccountController::class, 'getUserInfo']);
	Route::delete('{TravelerId}', [MyAccountController::class, 'deleteTraveler']);
	Route::get('getMyTrip', [MyAccountController::class,'getMyTrip']);
  });

Route::prefix('petropoints')->group(function() {
	Route::get('verify', function(Request $request) {
		$client = new Client([
            'base_uri' => 'https://res.itravel2000.com/res/library/petropoints/',
        ]);

		$response = $client->request('POST', 'PetroApi.php', [
            'body' => $request->input('q'),
            'timeout' => 60,
        ]);


		return Response::json(json_decode($response->getBody(), true));
	});
});

Route::prefix('addon')->group(function() {
	Route::get('search', 'API\AddonController@search');
                 Route::post('paginate', 'API\AddonController@paginate');
                 Route::post('filter', 'API\AddonController@filter');
                 Route::post('activity-details', 'API\AddonController@getActivityDetails');
                 Route::post('add', 'API\AddonController@addItem');
                 Route::post('remove', 'API\AddonController@removeItem');
});

Route::prefix('activity')->group(function() {
	Route::get('search', 'API\ActivityController@search');
	Route::get('details', 'API\ActivityController@details');
	Route::get('filter', 'API\ActivityController@filter');
	Route::get('paginate', 'API\ActivityController@paginate');
	Route::post('add', 'API\ActivityController@add');
        	Route::post('remove', 'API\ActivityController@remove');  
                 Route::get('autosuggest/{term?}', 'API\ActivityController@autosuggest');                
});


Route::get('setDeals', 'MarketingController@setDeal');

Route::get('getRates', "MarketingController@getRates");
