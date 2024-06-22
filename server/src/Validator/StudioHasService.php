<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class StudioHasService extends Constraint
{
    public $message = 'Le studio ne possède pas ou plus ce service.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
