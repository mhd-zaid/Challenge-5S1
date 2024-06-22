<?php

namespace App\Service;
use App\Entity\User;
use App\Repository\ReservationRepository;
use App\Repository\UnavailabilityHourRepository;
use App\Repository\WorkHourRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;


class SlotService {

    public function __construct(
        private WorkHourRepository $workHourRepo,
        private UnavailabilityHourRepository $unavailabilityHourRepo,
        private ReservationRepository $reservationRepo,
        private EntityManagerInterface $entityManager
    ){}

    public function calculateUserAvailability(\DateTime $startDate, \DateTime $endDate): array {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        
        $availabilityByDate = [];
    
        foreach ($users as $user) {
            $userAvailability = $this->getUserAvailabilityForPeriod($user, $startDate, $endDate);
            
            foreach ($userAvailability as $date => $slots) {
                if (!isset($availabilityByDate[$date])) {
                    $availabilityByDate[$date] = [];
                }
                
                foreach ($slots as $slot) {
                    $availabilityByDate[$date][] = [
                        'start' => $slot['start']->format('H:i'),
                        'end' => $slot['end']->format('H:i'),
                        'userId' => '/api/users/' . $user->getId(),
                    ];
                }
            }
        }
    
        return $availabilityByDate;
    }
    
    private function getUserAvailabilityForPeriod(User $user, \DateTime $startDate, \DateTime $endDate): array {
        $workHours = $this->workHourRepo->findByEmployeeAndDateRange($user, $startDate, $endDate);
        $unavailabilityHours = $this->unavailabilityHourRepo->findByEmployeeAndDateRange($user, $startDate, $endDate);
        $reservations = $this->reservationRepo->findByEmployeeAndDateRange($user, $startDate, $endDate);
    
        $availabilities = [];
    
        $currentDate = clone $startDate;
        while ($currentDate <= $endDate) {
            $dailySlots = $this->getDailyAvailability($workHours, $unavailabilityHours, $reservations, $currentDate);
            if (!empty($dailySlots)) {
                $availabilities[$currentDate->format('Y-m-d')] = $dailySlots;
            }
            $currentDate->modify('+1 day');
        }
    
        return $availabilities;
    }
    
    private function getDailyAvailability(array $workHours, array $unavailabilityHours, array $reservations, \DateTime $date): array {
        $dailyWorkHours = array_filter($workHours, function($wh) use ($date) {
            return $wh->getStartTime()->format('Y-m-d') == $date->format('Y-m-d');
        });
    
        $dailyUnavailability = array_filter($unavailabilityHours, function($uh) use ($date) {
            return $uh->getStartTime()->format('Y-m-d') == $date->format('Y-m-d');
        });
    
        $dailyReservations = array_filter($reservations, function($res) use ($date) {
            return $res->getDate()->format('Y-m-d') == $date->format('Y-m-d');
        });
    
        $availableSlots = [];
        foreach ($dailyWorkHours as $workHour) {
            $start = clone $workHour->getStartTime();
            $end = clone $workHour->getEndTime();
            while ($start < $end) {
                $slotEnd = (clone $start)->modify('+1 hour');
                if ($slotEnd > $end) {
                    $slotEnd = $end;
                }
                $availableSlots[] = ['start' => clone $start, 'end' => clone $slotEnd];
                $start = $slotEnd;
            }
        }
    
        foreach ($dailyUnavailability as $unavailability) {
            $availableSlots = array_filter($availableSlots, function ($slot) use ($unavailability) {
                return !($slot['start'] >= $unavailability->getStartTime() && $slot['end'] <= $unavailability->getEndTime());
            });
        }
    
        foreach ($dailyReservations as $reservation) {
            $availableSlots = array_filter($availableSlots, function ($slot) use ($reservation) {
                return !($slot['start'] >= $reservation->getDate() && $slot['end'] <= (clone $reservation->getDate())->modify('+1 hour'));
            });
        }
    
        return $availableSlots;
    }
    
}