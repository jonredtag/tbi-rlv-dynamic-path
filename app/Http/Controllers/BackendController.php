<?php
namespace App\Http\Controllers;

class BackendController extends Controller
{
    public function __construct()
    {

    }

    public function hotels()
    {
        $parameters = [];
        $page = 'htl-manager';
        return view('pages.backend.hotels', compact(['parameters','page']));
    }
}
