<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustyouHotelReview extends Model
{
    protected $table = "trustyou_hotel_review";
    protected $connection = 'trustyou';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function badges()
    {
        return $this->hasMany(TrustyouHotelReviewBadge::class, 'UnicaID', 'UnicaID');
    }
}
