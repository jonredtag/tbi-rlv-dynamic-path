<?php
namespace App\Services\Deals;

use App\Models\ProfileSession;
use App\Models\UserProductWatch;

class DealsService
{

    protected $dealsRepo;

    public function __construct($dealsRepo)
    {
        $this->dealsRepo = $dealsRepo;
    }

    public function insertHotelDeals($deals, $searchParams)
    {
        $this->dealsRepo->insertHotelDeals($deals, $searchParams);
    }

    public function insertDynamicDeals($deals, $searchParams)
    {
        /* ******** Requirements *********
        - Hotel stay matches flights
        - Only 1 room occupany
        - Only 2 adult travellers
         ***************************** */
        if (empty($searchParams['depDateHotel']) && count($searchParams['occupancy']) === 1 && $searchParams['occupancy'][0]['children'] === 0 && $searchParams['occupancy'][0]['adults'] === 2) {
            $this->dealsRepo->insertDynamicDeals($deals, $searchParams);
        }
    }

    public function discoverWatcher($hash)
    {
        $watcherData =  [
            'name' => '',
            'phone' => '',
            'email' => '',
        ];

        // if ($hash !== 'null') {
        //     // previous watch item found - let's use that to populate fields
        //     $currentRecord = UserProductWatch::where('hash', '=', $hash)->first();

        //     if (!is_null($currentRecord)) {
        //         $watcherData = [
        //             'name' => $currentRecord->Name,
        //             'phone' => $currentRecord->PhoneNumber,
        //             'email' => $currentRecord->Email,
        //         ];
        //     }
        // } else {
        // ok try to find their user info from session db
        if (isset($_COOKIE['PassportUserToken'])) {
            $profile = ProfileSession::where('CookieKey', '=', $_COOKIE['PassportUserToken'])->first();
            if (!is_null($profile)) {
                $data = json_decode($profile->Data, true);
                // good, we have their session data - return and prepopulate
                $watcherData = [
                    'name' => $data['user_data']['loginResult']['firstName'] . ' ' . $data['user_data']['loginResult']['lastName'],
                    // 'phone' => $data['user_data']['loginResult']['mobileTelephone'] ?? $data['user_data']['loginResult']['homeTelephone'],
                    'email' => $data['user_data']['loginResult']['email'],
                ];
            }
        }
        // }

        return $watcherData;
    }

    public function addWatchProduct($data)
    {
        $hash = $data['key'];

        if (is_null($hash)) {
            $currentRecord = UserProductWatch::where('email', '=', $data['email'])->first();

            if (is_null($currentRecord)) {
                do {
                    $hash = md5(uniqid(true));
                    $currentRecord = UserProductWatch::where('hash', '=', $hash)->first();
                } while (!is_null($currentRecord));
            } else {
                $hash = $currentRecord->Hash;
            }
        }

        $record = new UserProductWatch;

        $record->Hash = $hash;
        $record->Name = $data['name'];
        $record->Email = $data['email'];
        $record->HotelID = $data['hotelID'];
        $record->DepartureDate = $data['depart'];
        $record->ReturnDate = $data['return'];
        $record->Rate = $data['rate'];
        $record->ProductData = json_encode($data['productData']);
        $record->SearchParameters = json_encode($data['searchParameters']);

        if (!empty($data['userID'])) {
            $record->UserID = $data['userID'];
        }
        if (!empty($data['phone'])) {
            $record->PhoneNumber = $data['phone'];
        }

        $record->save();

        return ['key' => $hash];
    }

    public function getWatchList($hash, $email)
    {
        $data = UserProductWatch::select('ProductData', 'SearchParameters', 'ID')
            ->where('Hash', '=', $hash)
            ->where('Email', '=', $email)
            ->where('deleted', '=', 0)
            ->get();

        $response = [];
        if($data !== null) {
            foreach($data as $row) {
                $response[] = [
                    "id" => $row['ID'],
                    "productData" => json_decode($row['ProductData']),
                    'searchParameters' => json_decode($row['SearchParameters']),
                ];
            }
        }

        return $response;
    }

    public function getWatchListHotels($data){
        $data['userid'] = 0;
        if(isset($_COOKIE['PassportUserToken'])) {
            $profileSession = ProfileSession::where('CookieKey', '=', $_COOKIE['PassportUserToken'])->first();

            if(!is_null($profileSession)){
                $user = json_decode($profileSession->Data, true);
                $data['userid'] = $user['user_data']['loginResult']['userId'];
            }
        }

        $data = UserProductWatch::select('HotelID')
            ->where('UserID', '=', $data['userid'])
            ->where('DepartureDate', '=', date('Y-m-d',strtotime($data['depdate']) ))
            ->where('ReturnDate', '=', date('Y-m-d',strtotime($data['retdate']) ))
            ->where('deleted', '=', 0)
            ->get();

        $response = [];
        if($data !== null) {
            foreach($data as $row) {
                $response[] = intval($row['HotelID']);
            }
        }

        return $response;
    }

    public function removeWatch($hash, $id)
    {
        $row = UserProductWatch::where('Hash', '=', $hash)
            ->where('ID', '=', $id)
            ->first();

        $row->Deleted = 1;
        $row->DeletedDate = date('Y-m-d H:i:s');

        $row->save();

        return ["success" => 1];
    }

    public function isHotelWatched($params)
    {
        $response = false;
        if (isset($_COOKIE['PassportUserToken'])) {
            $profile = ProfileSession::where('CookieKey', '=', $_COOKIE['PassportUserToken'])->first();
            if (!is_null($profile)) {
                $user = json_decode($profile->Data, true);
                $data = UserProductWatch::select('HotelID')
                    ->where('UserID', '=', $user['user_data']['loginResult']['userId'])
                    ->where('HotelID', '=', $params['hotelID'])
                    ->where('DepartureDate', '=', date('Y-m-d',strtotime($params['depDate']) ))
                    ->where('ReturnDate', '=', date('Y-m-d',strtotime($params['retDate']) ))
                    ->where('deleted', '=', 0)
                    ->first();

                $response = !is_null($data);
            }
        }

        return $response;
    }
}
