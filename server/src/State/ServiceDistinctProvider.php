<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\ServiceRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Serializer\SerializerInterface;

class ServiceDistinctProvider implements ProviderInterface
{
    public function __construct(private LoggerInterface $logger, private ServiceRepository $serviceRepository,private SerializerInterface $serializer)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []):  object|array|null
    {
        $authorizedColumns = ['id', 'name', 'description', 'cost', 'duration', 'studio'];
        $column = $uriVariables['column'] ?? null;

        $this->logger->info('Processing distinct services', ['column' => $column]);

        if (!in_array($column, $authorizedColumns)) {
            $this->logger->error('Invalid column requested', ['column' => $column]);
            throw new BadRequestHttpException('Invalid column');
        }

        return $this->serviceRepository->findAllDistinctByColumn($column);
    }
}
