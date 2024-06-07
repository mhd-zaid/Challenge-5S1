<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use App\State\SendVerifyMailStateProcessor;

#[ApiResource(
    operations: [
        new Patch(processor: SendVerifyMailStateProcessor::class, uriTemplate: '/send-verification-email'),
    ],
)]
class SendVerifyMail 
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