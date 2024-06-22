<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class AvailableSlot extends Constraint
{
    public $message = 'L\'horaire n\'est plus disponible.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
