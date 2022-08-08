<?php

namespace App\Repositories\Contracts;

/**
 * An interface to set the methods in our API repositories
 */
interface APIInterface
{
	public function search($params);
	public function details($params);
	public function verify($params);
	public function book($params);
}
