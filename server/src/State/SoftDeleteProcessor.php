<?php

namespace App\State;

use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;

class SoftDeleteProcessor implements ProcessorInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function process($data, $operation, array $uriVariables = [], array $context = [])
    {
        $data->setDeletedAt(new \DateTime());
        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }
}