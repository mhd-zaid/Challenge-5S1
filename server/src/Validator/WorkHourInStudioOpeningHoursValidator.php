<?php

namespace App\Validator;

use App\Entity\WorkHour;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class WorkHourInStudioOpeningHoursValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof WorkHourInStudioOpeningHours) {
            throw new UnexpectedTypeException($constraint, WorkHourInStudioOpeningHours::class);
        }

        if (!$value instanceof WorkHour) {
            throw new UnexpectedValueException($value, WorkHour::class);
        }
        $date = $value->getStartTime();
        $startTime = $value->getStartTime()->format('H:i:s');
        $endTime = $value->getEndTime()->format('H:i:s');
        $studio = $value->getStudio();

        $day = intval($date->format('w'));
        if ($studio === null) {
            return;
        }
        
        $openingTime = $studio->getStudioOpeningTimes()->filter(fn($oh) => $oh->getDay() === $day)->first()?->getStartTime()->format('H:i:s');
        $closingTime = $studio->getStudioOpeningTimes()->filter(fn($oh) => $oh->getDay() === $day)->first()?->getEndTime()->format('H:i:s');

        if ($openingTime === null || $closingTime === null) {
            return;
        }

        if ($startTime < $openingTime) {
            $this->context->buildViolation($constraint->message)
                ->atPath('startTime')
                ->addViolation();
        }
        
        if ($endTime > $closingTime) {
            $this->context->buildViolation($constraint->message)
                ->atPath('endTime')
                ->addViolation();
        }
    }
}
