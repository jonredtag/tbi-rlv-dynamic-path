<?php
namespace App\Services\Reviews;

use \Illuminate\Support\Facades\Facade;

/**
*
*/
class ReviewsFacade extends Facade {

    protected static function getFacadeAccessor() { return ReviewsService::class; }
}
