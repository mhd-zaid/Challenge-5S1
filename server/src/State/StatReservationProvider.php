<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\ReservationRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

Class StatReservationProvider implements ProviderInterface
{
    public function __construct(private ReservationRepository $reservationRepository, private Security $security)
    {

    }
    
    public function provide(Operation $operation, array $uriVariables = [], array $context = []) : object|array|null
    {
        $employee = $this->security->getUser();
        
        if ($employee === null || (!in_array('ROLE_ADMIN', $employee?->getRoles()) && !in_array('ROLE_EMPLOYEE', $employee?->getRoles()))){
            throw new AccessDeniedHttpException();
        }
        
        $reservations = $this->reservationRepository->findBy(['employee' => $employee->getId()]);

        return $this->getStats($reservations);
    }

    private function getStats(array $reservations): array
    {
        $counts = [];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        foreach ($reservations as $reservation) {
            $date = $reservation->getDate();
            $year = $date->format('Y');
            $monthIndex = (int)$date->format('n') - 1;

            if (!isset($counts[$year])) {
                $counts[$year] = [
                    'year' => $year,
                    'total' => 0,
                    'totalCA' => 0,
                    'months' => array_fill_keys($monthNames, ['total' => 0, 'totalCA' => 0]),
                ];
            }

            $counts[$year]['total']++;
            $counts[$year]['totalCA'] += $reservation->getService()->getCost();

            $counts[$year]['months'][$monthNames[$monthIndex]]['total']++;
            $counts[$year]['months'][$monthNames[$monthIndex]]['totalCA'] += $reservation->getService()->getCost();
        }

        krsort($counts);

        return $counts;
    }
    
}