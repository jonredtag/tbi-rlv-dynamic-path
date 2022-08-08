<?php
namespace App\Repositories\Concrete;

class DealsRepository {

    function __construct() {}

    public function insertHotelDeals($deals, $searchParams) {
        $hotelSpecialDBTable = (config('app.currency') == 'USD')? 'hotel_specials_new_usd':'hotel_specials_new';

    
        foreach ($deals['hotels'] as $deal) {
            $query = [
                'HotelID' => $deal['unicaID'],
                'CheckIn' => $searchParams['depDate'],
                'CheckOut' => $searchParams['retDate']
            ];

            $fields = [
                'Name' => $deal['name'],
                'Image' => $deal['image'],
                'Rating' => $deal['rating'],
                'Review' => $deal['reviewRating'],
                'Nearby' => $deal['nearby'],
                'NightlyRate' => $deal['rate'],
                'Total' => $deal['costPerRoom'],
                'SearchParameters' => json_encode($searchParams),
                'Supplier' => $deal['vendor'],
                'Latitude' => $deal['latitude'],
                'Longitude' => $deal['longitude'],
                'CityID' => $searchParams['destination']['cityId'] ?? 0,
                'UpdatedDate' => date('Y-m-d H:i:s'),
            ];
            \DB::connection('deals')
                ->table($hotelSpecialDBTable)
                ->updateOrInsert($query, $fields);
        }
    }

    public function insertDynamicDeals($deals, $searchParams) {
        $dynamicSpecialDBTable = (config('app.currency') == 'USD')? 'dynamic_deals_usd':'dynamic_deals';

        foreach ($deals['hotels'] as $deal) {
            $query = [
                'HotelID' => $deal['unicaID'],
                'DepartureDate' => $searchParams['depDate'],
                'ReturnDate' => $searchParams['retDate']
            ];

            $fields = [
                'Name' => $deal['name'],
                'Image' => $deal['image'],
                'Rating' => $deal['rating'],
                'Review' => $deal['reviewRating'],
                'ReviewDescription' => $deal['reviewRatingDescription'],
                'Nearby' => $deal['nearby'],
                'Price' => $deal['rate'],
                'Amenities' => json_encode($deal['amenities']),
                'SearchParameters' => json_encode($searchParams),
                'Origin' => $deal['origin'],
                'Destination' => $deal['destination'],
                'Latitude' => $deal['latitude'],
                'Longitude' => $deal['longitude'],
                'CityID' => $searchParams['destination']['cityId'] ?? 0,
                'UpdatedDate' => date('Y-m-d H:i:s'),
                'Products' => $searchParams['selectedProducts'],
            ];
            \DB::connection('deals')
                ->table($dynamicSpecialDBTable)
                ->updateOrInsert($query, $fields);
        }
    }
}
