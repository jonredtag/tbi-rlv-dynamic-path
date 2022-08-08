<?php
namespace App\Repositories\Contracts;

/**
 * An interface to set the methods in our API repositories
 */
interface CartInterface
{
	public function initCart($cartId);
	public function addItem($data);
	public function getDetails();
	public function verify();
}
