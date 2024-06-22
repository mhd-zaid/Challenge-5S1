<?php

namespace App\Validator;

use App\Entity\Reservation;
use App\Service\SlotService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Doctrine\ORM\EntityManagerInterface;

class AvailableSlotValidator extends ConstraintValidator
{
    public function __construct(private EntityManagerInterface $entityManager, private SlotService $slotService)
    {
    }

    public function validate($value, Constraint $constraint)
    {
        /** @var Reservation $reservation */
        $reservation = $value;

        if (!$reservation instanceof Reservation) {
            return;
        }

        $date = $reservation->getDate();
        $employee = $reservation->getEmployee();

        if (!$date || !$employee) {
            return;
        }

        if(!$this->slotService->isReservationPossible($employee, $date)) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
