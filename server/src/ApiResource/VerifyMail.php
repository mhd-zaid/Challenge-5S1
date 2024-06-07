<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use App\State\VerifyMailStateProcessor;

#[ApiResource(
    operations: [
        new Patch(processor: VerifyMailStateProcessor::class, uriTemplate: '/verify-mail'),
    ],
)]
class VerifyMail 
{
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