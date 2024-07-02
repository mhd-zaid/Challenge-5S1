<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\UnavailabilityHour;
use App\Entity\User;
use App\Entity\WorkHour;
use App\Entity\Reservation;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Bundle\SecurityBundle\Security;

class PlanningProvider implements ProviderInterface
{
    public function __construct(
        private LoggerInterface $logger, 
        private Security $security,
        private EntityManagerInterface $em,
    )
    {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            throw new BadRequestHttpException('User not found');
        }
        
        if (in_array('ROLE_PRESTA', $user->getRoles())) {
            return $this->getPrestaPlanning($user);
        }
        
        if (in_array('ROLE_EMPLOYEE', $user->getRoles())) {
            return $this->getEmployeePlanning($user);
        }
        
        return [];
    }

    private function getEmployeePlanning(User $user): array
    {
        $workHours = $this->em->getRepository(WorkHour::class)->findBy(['employee' => $user->getId()]);
        $unavailabilityHours = $this->em->getRepository(UnavailabilityHour::class)->findBy([
            'employee' => $user->getId(),
            'status' => 'Accepted',
        ]);

        $reservations = $this->em->getRepository(Reservation::class)->findBy([
            'employee' => $user->getId(),
            'status' => 'RESERVED',
        ]);

        return $this->createPlanning($workHours, $unavailabilityHours, $reservations);
    }

    private function getPrestaPlanning(User $user): array
    {
        $studios = $user->getCompany()->getStudios();
        $users = $user->getCompany()->getUsers();
        $workHours = new ArrayCollection();
        foreach ($studios as $studio) {
            foreach ($studio->getWorkHours() as $workHour) {
                $workHours->add($workHour);
            }
        }

        $unavailabilityHours = new ArrayCollection();
        foreach ($users as $user) {
            foreach ($user->getUnavailabilityHours() as $unavailabilityHour) {
                if ($unavailabilityHour->getStatus() === 'Accepted') {
                    $unavailabilityHours->add($unavailabilityHour);
                }
            }
        }

        $reservations = new ArrayCollection();
        foreach($studios as $studio) {
            foreach ($studio->getReservations() as $reservation) {
                if ($reservation->getStatus() === 'RESERVED') {
                    $reservations->add($reservation);
                }
            }
        }
        
        return $this->createPlanning($workHours, $unavailabilityHours, $reservations);
    }

    private function createPlanning(iterable $workHours, iterable $unavailabilityHours, iterable $reservations): array
    {
        $planning = [];

        foreach ($workHours as $workHour) {
            $workHourData = [
                'type' => 'workHour',
                'start' => $workHour->getStartTime(),
                'end' => $workHour->getEndTime(),
                'studio' => $workHour->getStudio(),
                'employee' => $workHour->getEmployee(),
                'idEvent' => $workHour->getId(),
                'hasUnavailabilityHours' => false,
            ];

            foreach ($unavailabilityHours as $unavailabilityHour) {
                if ($this->isOverlapping($workHour, $unavailabilityHour)) {
                    $workHourData['hasUnavailabilityHours'] = true;
                    break;
                }
            }

            $planning[] = $workHourData;
        }

        foreach ($reservations as $reservation) {
            $reservationData = [
                'type' => 'reservation',
                'id' => $reservation->getId(),
                'date' => $reservation->getDate(),
                'status' => $reservation->getStatus(),
                'customer' => $reservation->getCustomer(),
                'employee' => $reservation->getEmployee(),
                'studio' => $reservation->getStudio(),
                'healthy' => false,
            ];

            foreach ($workHours as $workHour) {
                if ($this->isContainedWithin($reservation, $workHour) && 
                    !$this->isOverlappingWithAny($workHour, $unavailabilityHours) && 
                    $this->isInSameStudioAndEmployee($reservation, $workHour)) {
                    $reservationData['healthy'] = true;
                    break;
                }
            }

            $planning[] = $reservationData;
        }

        return $planning;
    }

    private function isOverlapping(WorkHour $workHour, UnavailabilityHour $unavailabilityHour): bool
    {
        return $workHour->getStartTime() < $unavailabilityHour->getEndTime() &&
               $workHour->getEndTime() > $unavailabilityHour->getStartTime() &&
               $workHour->getEmployee() === $unavailabilityHour->getEmployee();
    }

    private function isContainedWithin(Reservation $reservation, WorkHour $workHour): bool
    {

        return $reservation->getDate() >= $workHour->getStartTime() && (clone $reservation->getDate())->modify('+1 hour') <= $workHour->getEndTime();
    }

    private function isOverlappingWithAny(WorkHour $workHour, iterable $unavailabilityHours): bool
    {
        foreach ($unavailabilityHours as $unavailabilityHour) {
            if ($this->isOverlapping($workHour, $unavailabilityHour)) {
                return true;
            }
        }
        return false;
    }

    private function isInSameStudioAndEmployee(Reservation $reservation, WorkHour $workHour): bool
    {
        return $reservation->getStudio() === $workHour->getStudio() && $reservation->getEmployee() === $workHour->getEmployee();
    }
}
