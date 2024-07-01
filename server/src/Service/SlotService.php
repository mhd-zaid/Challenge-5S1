<?php

namespace App\Service;
use App\Entity\User;
use App\Repository\ReservationRepository;
use App\Repository\UnavailabilityHourRepository;
use App\Repository\WorkHourRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Reservation;
use App\Entity\Studio;

class SlotService {

    public function __construct(
        private WorkHourRepository $workHourRepo,
        private UnavailabilityHourRepository $unavailabilityHourRepo,
        private ReservationRepository $reservationRepo,
        private EntityManagerInterface $entityManager
    ){}

    public function calculateUserAvailability(\DateTime $startDate, \DateTime $endDate, Studio $studio): array {
        $users = $studio->getCompany()->getUsers();
            
        $availabilityByDateAndSlot = [];
        
        foreach ($users as $user) {
            $userAvailability = $this->getUserAvailabilityForPeriod($user, $startDate, $endDate, $studio);
            
            foreach ($userAvailability as $date => $slots) {
                if (!isset($availabilityByDateAndSlot[$date])) {
                    $availabilityByDateAndSlot[$date] = [];
                }
                
                foreach ($slots as $slot) {

                    $start = $slot['start']->format('H:i');
                    $end = $slot['end']->format('H:i');
                    
                    if (!isset($availabilityByDateAndSlot[$date]["$start-$end"])) {
                        $availabilityByDateAndSlot[$date]["$start-$end"] = [
                            'start' => $start,
                            'end' => $end,
                            'users' => [],
                        ];
                    }
                    
                    $availabilityByDateAndSlot[$date]["$start-$end"]['users'][] = [
                        'id' => '/api/users/' . $user->getId(),
                        'fullname' => $user->getFirstname() . ' ' . $user->getLastname(),
                    ];                
                }

            }
        }
        
        $availabilityByDate = [];
        foreach ($availabilityByDateAndSlot as $date => $slots) {
            foreach ($slots as $slot) {
                $availabilityByDate[$date][] = $slot;
            }
        }
        
        return $availabilityByDate;
    }
    
    private function getUserAvailabilityForPeriod(User $user, \DateTime $startDate, \DateTime $endDate, Studio $studio): array {
        $workHours = $this->workHourRepo->findByEmployeeAndDateRange($user, $startDate, $endDate, $studio);
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

    public function isReservationPossible(Reservation $currentReservation): bool
    {
        $employee = $currentReservation->getEmployee();

        $time = $currentReservation->getDate();

        $workHours = $this->workHourRepo->findByEmployeeAndDateRange($employee, $time, $time, $currentReservation->getStudio());
        $unavailabilityHours = $this->unavailabilityHourRepo->findByEmployeeAndDateRange($employee, $time, $time);
        $reservations = $this->reservationRepo->findByEmployeeAndDateRange($employee, $time, $time);

        foreach ($reservations as $key => $reservation) {
            if ($currentReservation && $reservation->getId() === $currentReservation->getId()) {
                unset($reservations[$key]);
                break;
            }
        }
        
        $dailySlots = $this->getDailyAvailability($workHours, $unavailabilityHours, $reservations, $time);

        $desiredStartTime = clone $time;
        $desiredEndTime = (clone $desiredStartTime)->modify('+1 hour');

        foreach ($dailySlots as $slot) {
            $slotStart = $slot['start'];
            $slotEnd = $slot['end'];

            if ($desiredStartTime >= $slotStart && $desiredEndTime <= $slotEnd) {
                return true; 
            }
        }

        return false;
    }

    
}