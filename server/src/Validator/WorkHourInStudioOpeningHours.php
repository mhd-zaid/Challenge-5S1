<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class WorkHourInStudioOpeningHours extends Constraint
{
    public $message = 'Les heures de travail doivent être dans les plages d\'ouverture du studio.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
