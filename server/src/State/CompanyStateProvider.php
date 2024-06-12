<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Company;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;

class CompanyStateProvider implements ProviderInterface
{

    public function __construct(
     private readonly EntityManagerInterface $em,
    )
    {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // Retrieve the state from somewhere
//        $context = $this->getCompany();

//        dd($operation, $uriVariables, $context);
//        if($operation instanceof CollectionOperationInterface) {
//            return null;
//        }
        return $this->em->getRepository(Company::class)->findAll() ?? null;
    }
}
