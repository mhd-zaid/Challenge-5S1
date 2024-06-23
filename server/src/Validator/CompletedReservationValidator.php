<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use App\Entity\Feedback;

class CompletedReservationValidator extends ConstraintValidator
{
    public function validate($feedback, Constraint $constraint)
    {
        if (!$feedback instanceof Feedback) {
            return;
        }

        if ($feedback->getReservation()->getStatus() !== 'COMPLETED') {
            $this->context->buildViolation($constraint->message)
                ->atPath('reservation')
                ->addViolation();
        }
    }
}