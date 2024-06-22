<?php

// src/Validator/CompletedReservation.php
namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class CompletedReservation extends Constraint
{
    public $message = 'La réservation doit être complétée pour ajouter un feedback.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
