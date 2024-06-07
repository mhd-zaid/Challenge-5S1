<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use App\State\ResetPasswordStateProcessor;

#[ApiResource(
    operations: [
        new Patch(processor: ResetPasswordStateProcessor::class, uriTemplate: '/reset-password'),
    ],
)]
class ResetPassword 
{
    protected string $token;
    protected string $password;


    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): void
    {
        $this->token = $token;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }
}