<?php

namespace App\Services\Cart;

use App\Repositories\Contracts\CartInterface;


/**
* Our EventsService, containing all useful methods for business logic around Events
*/
class CartService
{
	// Containing our eventsRepository to make all our database calls to
	protected $cartRepo;

	/**
	* @param cartInterface $cartRepo
	* @return EventsService
	*/
	public function __construct(CartInterface $cartRepo)
	{
		$this->cartRepo = $cartRepo;
	}

	public function add($cartId, $data){

		$this->cartRepo->setCart($cartId);

		return $this->cartRepo->addItem($data);

	}

	public function remove($cartId, $item)
	{
		$this->cartRepo->setCart($cartId,$item);

		return $this->cartRepo->removeItem($item);
	}

	public function init($cartId = null){

		return $this->cartRepo->initCart($cartId);
	}

	public function get($cartId){
		$this->cartRepo->setCart($cartId);

		return $this->cartRepo->getDetails();
	}

	public function update($cartId, $data)
	{
		$this->cartRepo->setCart($cartId);

		$this->cartRepo->update($data);
	}

	public function verify($cartId){

		$this->cartRepo->setCart($cartId);

		return $this->cartRepo->verify();
	}

	public function book($cartId, $params){

		$this->cartRepo->setCart($cartId);
		return $this->cartRepo->book($params);

	}

}
