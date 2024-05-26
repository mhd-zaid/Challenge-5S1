<?php

namespace App\Controller;

use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ServiceController extends AbstractController
{

    #[Route('/api/services/distinct/{column}', name: 'get_services_distinct_by_column', methods: ['GET'])]
    public function getServicesDistinctByColumn(string $column,EntityManagerInterface $em,SerializerInterface $serializer): Response
    {
        $services = $em->getRepository(Service::class)->findAllDistinctByColumn($column);
        $normalizedData = $serializer->normalize($services, null, [
            AbstractNormalizer::GROUPS => ['service:read'],
        ]);
        
        $hydraCollection = [
            '@context' => '/api/contexts/Service',
            '@id' => '/api/services/distinct/' . $column,
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => count($normalizedData),
            'hydra:member' => $normalizedData
        ];

        return $this->json($hydraCollection);
    }
}