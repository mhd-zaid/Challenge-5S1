<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class EmployeeBelongsToStudio extends Constraint
{
    public $message = 'L\'employé n\'appartient pas au studio.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
