<?php

namespace App\Repositories\Contracts;

/**
 * An interface to set the methods in our API repositories
 */
interface CustomAuthInterface {

    public function login($params);

    public function logout();

    public function create($params);

    public function getEmail($params);

    public function PostforgetPassword($params);

    public function getTokenResponse($params);

    public function submitPassword($params);

  
}
