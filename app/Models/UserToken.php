<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model {
	// protected $connection = 'redtag';
	protected $table = 'users_token';
	protected $primaryKey = 'id';
	protected $fillable = ['id', 'user_id', 'token'];
	public $timestamps = true;
}
