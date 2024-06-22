<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use App\Entity\Feedback;
use App\Repository\FeedbackRepository;

class FeedbackValidator extends ConstraintValidator
{
    public function __construct(private FeedbackRepository $feedbackRepository)
    {
    }

    public function validate($value, Constraint $constraint)
    {
        if($value->getId() != null) {
            $feedback = $this->feedbackRepository->find($value->getId());
            if($feedback->getReservation() != $value->getReservation()) {
                $this->context->buildViolation($constraint->message)->addViolation();
            }
        }
    }
}