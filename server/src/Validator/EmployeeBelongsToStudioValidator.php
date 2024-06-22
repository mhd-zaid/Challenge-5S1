<?php

namespace App\Validator;

use App\Entity\Reservation;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Doctrine\ORM\EntityManagerInterface;

class EmployeeBelongsToStudioValidator extends ConstraintValidator
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function validate($value, Constraint $constraint)
    {
        /** @var Reservation $reservation */
        $reservation = $value;

        if (!$reservation instanceof Reservation) {
            return;
        }

        $studio = $reservation->getStudio();
        $employee = $reservation->getEmployee();

        if (!$studio || !$employee) {
            return;
        }

        if(!$employee->getCompany()->getStudios()->contains($studio)) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
