<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use App\State\CheckTokenStateProcessor;

use ApiPlatform\Metadata\ApiProperty;

#[ApiResource(
    operations: [
        new Patch(processor: CheckTokenStateProcessor::class, uriTemplate: '/check-token'),
    ],
)]
class CheckToken 
{
    #[ApiProperty(identifier: true)]
    protected string $token;

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): void
    {
        $this->token = $token;
    }
}