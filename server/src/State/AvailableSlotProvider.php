<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Studio;
use Symfony\Component\HttpFoundation\Response;
use App\Service\SlotService;

class AvailableSlotProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SlotService $slotService
    ) {}
    
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $startDate = new \DateTime();
        $endDate = (clone $startDate)->modify('+1 month');
    
        $studio = $this->entityManager->getRepository(Studio::class)->find($uriVariables['studioId']);
        if (!$studio) {
            return new Response('Studio not found', Response::HTTP_NOT_FOUND);
        }
    
        $availabilities = $this->slotService->calculateUserAvailability($startDate, $endDate, $studio);
    
        $formattedAvailabilities = [];
    
        foreach ($availabilities as $date => $slots) {
            $formattedSlots = [];
            foreach ($slots as $slot) {
                $formattedSlots[] = [
                    'start' => $slot['start'],
                    'end' => $slot['end'],
                    'users' => $slot['users'],
                ];
            }
            $formattedAvailabilities[$date] = $formattedSlots;
        }
    
        return new Response(json_encode($formattedAvailabilities), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }
    
}
