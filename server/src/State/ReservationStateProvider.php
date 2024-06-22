<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\Security\Core\Security;
use App\Repository\ReservationRepository;

class ReservationStateProvider implements ProviderInterface
{

    public function __construct(private Security $security, private ReservationRepository $reservationRepository)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if (!$user) {
            throw new \Exception('Utilisateur non connecté.');
        }

        return $this->reservationRepository->findBy(['customer' => $user]);
    }
}
