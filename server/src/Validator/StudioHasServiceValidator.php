<?php

namespace App\Validator;

use App\Entity\Reservation;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Doctrine\ORM\EntityManagerInterface;

class StudioHasServiceValidator extends ConstraintValidator
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
        $service = $reservation->getService();

        if (!$studio || !$service) {
            return;
        }

        if (!$studio->getServices()->contains($service)) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
