<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\CheckTokenProvider;

use ApiPlatform\Metadata\ApiProperty;

#[ApiResource(
    operations: [
        new Get(provider: CheckTokenProvider::class, uriTemplate: '/check-token/{token}'),
    ],
)]
class CheckToken 
{
    #[ApiProperty(identifier: true)]
    protected string $token;

    public function getToken(): string
    {
        return $this->token;
    }

    public function setToken(string $token): void
    {
        $this->token = $token;
    }
}