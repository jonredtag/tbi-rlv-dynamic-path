<?php

namespace App\Repositories\Concrete;

use App\Models\ProfileSession;
use GuzzleHttp\Client as Guzzle;
use \GuzzleHttp\Cookie\CookieJar as CookieJar;

class UserProfileRepository
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
        $response = ["status" => false, "error" => ["message" => "there is no session"]];

        if(isset($_COOKIE['authid'])) {
            try {
                $response = $this->_apiClient->request('GET', "api/myAccount/getTravelerData", [
                    "query" => [
                        "authToken" => $_COOKIE['authid']
                    ]
                ]);

                $results = json_decode($response->getBody(), true);
                if($results['status']){

                    $response = [
                        "status" => true,
                        "firstName" => $results['data']['user']['firstname'],
                        "lastName" => $results['data']['user']['lastname'],
                        "userID" => $results['data']['user']['userId'],
                        "image" => $results['data']['user']['userProfile']
                    ];
                } else {
                    $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
                }
            } catch (\Exception $e) {
                $response = ['error' => ['code' => '', 'message' => $e->getMessage()]];
            }
        }

        return $response;
    }

    public function getProfileData()
    {
        $response = ["status" => false];
        if(isset($_COOKIE['authid'])) {
            try {
                $jar = CookieJar::fromArray(
                    [
                        'authid' => $_COOKIE['authid']
                    ],
                    config('site.domain')
                );
                $response = $this->_apiClient->request('GET', "api/myAccount/getPersonalInfo", [
                    "cookies" => $jar
                ]);

                $results = json_decode($response->getBody(), true);
                // dd($results);
                if($results['status']){
                    $response = [
                        "status" => true,
                        "email" => $results['personalinfo']["email"],
                        "first" => $results['personalinfo']["FirstName"],
                        "last" => $results['personalinfo']["LastName"],
                        "phone" => $results['personalinfo']["Phone"],
                        "year" => $results['personalinfo']["Year"],
                        "month" => $results['personalinfo']["Month"],
                        "day" => $results['personalinfo']["Day"],
                    ];
                } else {
                    $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
                }
            } catch (\Exception $e) {
                $response = ['error' => ['code' => '', 'message' => $e->getMessage()]];
            }
        }

        return $response;
    }

    public function login($params)
    {
        try {
            $response = $this->_apiClient->request('post', "api/users/login", [
                "query" => [
                    "data" => $params['data'],
                ]
            ]);
            $results = json_decode($response->getBody(), true);
            if($results['status']){
                $response = [
                    "status" => true,
                    "firstName" => $results['data']['firstname'],
                    "lastName" => $results['data']['lastname'],
                    "userID" => $results['data']['id'],
                    "image" => $results['data']['userProfile'],
                ];
                setcookie('authid', $results['token']['token'], time() + (86400 * 365), "/", config('site.domain'));
            } else {
                $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
            }
        } catch(Exception $e) {
            die('test');
        }

        return $response;
    }

    public function register($params)
    {
        try {
            $response = $this->_apiClient->request('post', "api/users/register", [
                "query" => [
                    "data" => $params['data'],
                ]
            ]);
            $results = json_decode($response->getBody(), true);
            if($results['status']){
                $response = $results;
            } else {
                $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
            }
        } catch(Exception $e) {
            die('test');
        }

        return $response;
    }

    public function forgotPassword($params)
    {
        try {
            $response = $this->_apiClient->request('post', "api/users/PostforgetPassword", [
                "query" => [
                    "data" => $params['data'],
                ]
            ]);
            $results = json_decode($response->getBody(), true);
            if($results['status']){
                $response = $results;
            } else {
                $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
            }
        } catch(Exception $e) {
            die('test');
        }

        return $response;
    }

    public function logout()
    {
        try {
            $response = $this->_apiClient->request('post', "api/users/logout", [
             ]);
            $results = json_decode($response->getBody(), true);
            if($results['status']){
                $response = $results;
                setcookie('authid', '', time() - 100, "/", config('site.domain'));
            } else {
                $response = ['status'=> false, 'error' => ['code' => '', 'message' => "something wrong"]];
            }
        } catch(Exception $e) {
            die('test');
        }

        return $response;
    }
}
