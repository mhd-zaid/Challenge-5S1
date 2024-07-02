<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiProperty;
use App\State\FileProvider;
use App\State\GetFileProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/get-kbis/{path}',
            security: "is_granted('ROLE_ADMIN')",
            provider: FileProvider::class
        ),
    ],
)]
class GetKbis
{
    #[ApiProperty(identifier: true)]
    protected string $path;

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $token): void
    {
        $this->token = $token;
    }
}