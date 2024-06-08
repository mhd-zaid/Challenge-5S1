<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use App\State\SendForgetPasswordStateProcessor;

#[ApiResource(
    operations: [
        new Patch(processor: SendForgetPasswordStateProcessor::class, uriTemplate: '/send-forget-password'),
    ],
)]
class SendForgetPassword 
{
    protected string $email;

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
}