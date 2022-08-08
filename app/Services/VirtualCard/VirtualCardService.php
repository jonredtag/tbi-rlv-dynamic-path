<?php

namespace App\Services\VirtualCard;

class VirtualCardService
{
    protected $virtualCardRepo;

    public function __construct($virtualCardRepo)
    {
        $this->virtualCardRepo = $virtualCardRepo;
    }

    public function getVirtualCard($param)
    {
        return $this->virtualCardRepo->getVirtualCard($param);
    }

    public function cancelVirtualCard($merchantId)
    {
        $this->virtualCardRepo->cancelVirtualCard($merchantId);
    }
}
