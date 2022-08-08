<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustyouHotelReviewBadge extends Model
{
    protected $table = "trustyou_hotel_review_badge";
    protected $connection = 'trustyou';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
