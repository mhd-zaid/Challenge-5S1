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

        if (in_array('ROLE_PRESTA', $user->getRoles())) {
            return $this->getPrestaReservations($user);
        }

        if (in_array('ROLE_CUSTOMER', $user->getRoles())) {
            return $this->getCustomerReservations($user);
        }

        return [];
    }
    
    private function getPrestaReservations($user): array
    {
        $studios = $user->getCompany()->getStudios();
        $reservationsCollection = [];
        foreach ($studios as $studi) {
            foreach ($studi->getReservations() as $reservation) {
                $reservationsCollection[] = $reservation;
            }
        }
        return $reservationsCollection;
    }

    private function getCustomerReservations($user): array
    {
        return $user->getReservations();
    }
}
