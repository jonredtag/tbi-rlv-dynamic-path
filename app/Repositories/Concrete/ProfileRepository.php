<?php

namespace App\Repositories\Concrete;

use GuzzleHttp\Client as Guzzle;

class ProfileRepository {

    protected $_apiClient;

    public function __construct()
    {
        $this->_apiClient = new Guzzle(
            [
                'headers' => [
                    'x-api-key' => '28c2dcd8-1acb-418f-bd41-4e7430c63c5f'
                ],
                'base_uri' => config('api.profile'),
            ]
        );
    }

    public function register($params)
    {
        $query = [
            "session" => [
                'lan' => 'en',
            ],
            "registerRQ" => [
                'version' => 'v1',
                'inputs' => [
                    'title' => 'Title',
                    'firstName' => $params['first'],
                    'lastName' => $params['last'],
                    'email' => $params['email'],
                    'password' => $params['password'],
                    'passwordConfirmation' => $params['password'],
                ],
            ],
        ];
        
        try {
            $response = $this->_apiClient->request('POST', "api/register", [
                "query" => [
                    'request' => json_encode($query)
                ]
            ]);

            $results = json_decode($response->getBody(), true);
            // $results = json_decode('{"error":{"code":"1","message":"The E-mail Address has already been taken."}}', true);
            // $results = json_decode('{"session":{"id":"$2y$10$Z7l5Ie6G.v9ymgfNjTMoJeBE8i6ra8gnBRxtPqZWJEn0Yoji5YjB6","lan":"en"},"registerResult":{"accessToken":"$2y$10$Z7l5Ie6G.v9ymgfNjTMoJeBE8i6ra8gnBRxtPqZWJEn0Yoji5YjB6","userId":16720,"title":"Title","firstName":"Jonathan","lastName":"Tester","middleName":null,"email":"jonathan2@redtag.ca","language":"en","timezone":"America\/Toronto","profileImageUrl":null,"lastActivityAt":1624286071,"status":"notConfirmed","addresses":[],"travelers":[],"extras":[]}}', true);
        } catch (\Exception $e) {
            $results = ['error' => ['code' => '', 'message' => $e->getMessage()]];
        }

        return $results;
    }

    public function login($params)
    {
        $query = [
            'session' => [
                'lan' => 'en'
            ],
            'loginRQ' => [
                'version' => 'v1',
                'inputs' => [
                    'email' => $params['email'],
                    'password' => $params['password'],
                ],
            ],
        ];

        try {
            $response = $this->_apiClient->request('POST', "api/login", [
                "query" => [
                    'request' => json_encode($query)
                ]
            ]);

            $results = json_decode($response->getBody(), true);
            // $results = json_decode('{"error":{"code":"401","message":"These credentials do not match our records."}}', true);
            // $results = json_decode('{"session":{"id":"$2y$10$D6OofPObQ5Pmku2Wq4e8QO\/K5IHK4AkwNN6NN0nHcLNUiXWqr7uq.","lan":"en"},"loginResult":{"accessToken":"$2y$10$D6OofPObQ5Pmku2Wq4e8QO\/K5IHK4AkwNN6NN0nHcLNUiXWqr7uq.","userId":13513,"title":"Mr","firstName":"Jonathan","lastName":"Wiznuk","middleName":null,"dateOfBirth":"1979-08-31","email":"jonathan@redtag.ca","addressLine1":"123 testing avenue","addressLine2":"Eggs Street","city":"Toronto","postalCode":"M1M1M1","provinceState":"Prince Edward Island","provinceStateId":10,"country":"Canada","countryId":0,"emergencyContactName":"Nine One One","emergencyContactTelephone":"5551231234","homeTelephone":"4165551234","workTelephone":"","mobileTelephone":"4165556789","language":"en","timezone":"America\/Toronto","profileImageUrl":null,"lastActivityAt":1624052612,"travelers":[{"id":3,"title_id":"Mr","first_name":"Roger","last_name":"Smith","middle_name":"M","date_of_birth":"1924-12-24","frequentFlyers":[]}],"status":"active"}}', true);
        } catch (\Exception $e) {
            $results = ['error' => ['code' => '', 'message' => $e->getMessage()]];
        }

        return $results;
    }

    public function forgotPassword($params)
    {
        $query = [
            'session' => [
                'lan' => 'en'
            ],
            'forgotPasswordRQ' => [
                'version' => 'v1',
                'inputs' => [
                    'email' => $params['email']
                ],
            ],
        ];


        try {
            $response = $this->_apiClient->request('POST', "api/password/reset", [
                "query" => [
                    'request' => json_encode($query)
                ]
            ]);

            $results = json_decode($response->getBody(), true);
            // $results = json_decode('{"error":{"code":"401","message":"These credentials do not match our records."}}', true);
        } catch (\Exception $e) {
            $results = ['error' => ['code' => '', 'message' => $e->getMessage()]];
        }

        return $results;
    }
}
