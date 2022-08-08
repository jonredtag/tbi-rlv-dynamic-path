<?php

namespace App\Repositories\Concrete;

use App\Models\ProfileSession;
use GuzzleHttp\Client as Guzzle;

class CopoloProfileRepository
{
    protected $profileRepo;

    public function __construct()
    {
        $this->_apiClient = new Guzzle(
            [
                'base_uri' => config('api.profile'),
            ]
        );
    }

    public function checkProfile()
    {
        $user = ["error" => ["message" => "there is no session"]];

        if(isset($_COOKIE['authid'])) {
            try {
                $response = $this->_apiClient->request('GET', "getTravelerData", [
                    "query" => [
                        "authToken" => $_COOKIE['authid']
                    ]
                ]);

                $results = json_decode($response->getBody(), true);
                if($results['status']){

                    $user = [
                        "firstName" => $results['data']['user']['firstname'],
                        "lastName" => $results['data']['user']['lastname'],
                        "userID" => $results['data']['user']['userId'],
                    ];
                } else {
                    $user = ['error' => ['code' => '', 'message' => "something wrong"]];
                }
            } catch (\Exception $e) {
                $user = ['error' => ['code' => '', 'message' => $e->getMessage()]];
            }
        }

        return $user;
    }

    public function login($params)
    {
        $data = $this->profileRepo->login($params);

        if(empty($data['error'])) {
            $response = $this->setupUser($data);
        } else {
            $response = $data;
        }

        return $response;
    }

    public function register($params)
    {
        $data = $this->profileRepo->register($params);

        if(empty($data['error'])) {
            $data['loginResult'] = $data['registerResult'];
            unset($data['registerResult']);
            $response = $this->setupUser($data);
        } else {
            $response = $data;
        }

        return $response;
    }

    public function forgotPassword($params)
    {
        $data = $this->profileRepo->forgotPassword($params);

        return ["success" => true];
    }

    private function setupUser($data)
    {
        // md5 key
        $cookieKey = hash('tiger160,3', $data['loginResult']['accessToken']);

        // set cookie
        setcookie('PassportUserToken', $cookieKey, strtotime("+1 year"), '/', config('site.domain'));
        // db insert
        $userSession = new ProfileSession;

        $json['id'] = $data['session']['id'];
        $json['uid'] = $data['loginResult']['userId'];
        $json['accessToken'] = $data['loginResult']['accessToken'];
        $json['user_data'] = $data;

        $userSession->CookieKey = $cookieKey;
        $userSession->Data = json_encode($json, JSON_NUMERIC_CHECK);

        $userSession->save();
        $user = [
            "firstName" => $data['loginResult']['firstName'],
            "lastName" => $data['loginResult']['lastName'],
            "userID" => $data['loginResult']['userId'],
        ];

        return $user;
    }
}
