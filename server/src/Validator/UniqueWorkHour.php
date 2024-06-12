<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UniqueWorkHour extends Constraint
{
    public $message = 'L\'employé a déjà des heures de travail dans un autre studio pour ce créneau horaire.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
