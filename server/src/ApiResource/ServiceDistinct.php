<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\ServiceDistinctProvider;

#[ApiResource(
    normalizationContext: ['groups' => ['service:read']],
    operations: [
        new GetCollection(
            provider: ServiceDistinctProvider::class,
            uriTemplate: '/services/distinct/{column}',
            requirements: ['column' => '\w+'],
            description: 'Get all services distinct by column',
            paginationEnabled: false,
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'column',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'enum' => ['id', 'name', 'description', 'cost', 'duration', 'studio'],
                        ],
                        'description' => 'The column to distinct. Allowed values: id, name, description, cost, duration, studio',
                    ],
                ],
            ],
        ),
    ],
)]
class ServiceDistinct
{
    #[ApiProperty(identifier: true)]
    protected string $column;

    public function getColumn(): string
    {
        return $this->column;
    }

    public function setColumn(string $column): void
    {
        $this->column = $column;
    }
}