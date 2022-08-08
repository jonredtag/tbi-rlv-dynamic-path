<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityDestinations extends Model
{
    protected $table = "activity_destinations";

    protected $primaryKey = 'id';

    public function scopeWhereLike($query, $column, $value)
    {
        return $query->where($column, 'like', $value.'%');
    }
    
    public function scopeOrWhereLike($query, $column, $value)
    {
        return $query->orWhere($column, 'like', $value.'%');
    }
    
  
}
