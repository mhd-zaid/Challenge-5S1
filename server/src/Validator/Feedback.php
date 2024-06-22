<?php

// src/Validator/CompletedReservation.php
namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class Feedback extends Constraint
{
    public $message = 'Vous ne pouvez pas modifier de reservation pour un feedback déjà existant.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
