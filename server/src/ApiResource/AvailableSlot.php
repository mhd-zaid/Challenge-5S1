<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\AvailableSlotProvider;
use ApiPlatform\Metadata\ApiProperty;
use DateTime;

#[ApiResource(
    operations: [
        new Get(provider: AvailableSlotProvider::class, uriTemplate: '/available_slots/{studioId}'),
    ],
)]
class AvailableSlot 
{
    #[ApiProperty(identifier: true)]
    protected string $studioId;
    public function getStudioId(): string
    {
        return $this->studioId;
    }

    public function setStudioId(string $studioId): void
    {
        $this->studioId = $studioId;
    }
}