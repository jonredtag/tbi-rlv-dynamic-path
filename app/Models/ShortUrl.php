<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ShortUrl extends Model
{
	protected $fillable = ['slug', 'json', 'created_at', 'updated_at'];
	protected $table = 'short_urls';
}