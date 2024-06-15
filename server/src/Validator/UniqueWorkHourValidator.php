<?php

namespace App\Validator;

use App\Entity\WorkHour;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class UniqueWorkHourValidator extends ConstraintValidator
{
    public function __construct(private EntityManagerInterface $em)
    {}

    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof UniqueWorkHour) {
            throw new UnexpectedTypeException($constraint, UniqueWorkHour::class);
        }

        if (!$value instanceof WorkHour) {
            throw new UnexpectedValueException($value, WorkHour::class);
        }

        $startTime = $value->getStartTime();
        $endTime = $value->getEndTime();
        $employee = $value->getEmployee();

        if ($employee === null) {
            return;
        }

        $conflictsWorkHours = $this->em->getRepository(WorkHour::class)->findConflictsWorkHours($startTime, $endTime, $employee, $value->getId());

        if (count($conflictsWorkHours) > 0) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
