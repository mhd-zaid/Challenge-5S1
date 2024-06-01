<?php

namespace App\Validator;

class RequestValidator
{
    public function Validate($requestParameters, $expectedParameters): array
    {
        if(count($requestParameters) !== count($expectedParameters)) {
            return ['success' => false, 'error' => 'Invalid parameters', 'expected' => $expectedParameters, 'received' => $requestParameters];
        }
        foreach ($expectedParameters as $expectedParameter) {
            if (!array_key_exists($expectedParameter, $requestParameters)) {
                return ['success' => false, 'error' => 'Invalid ' . $expectedParameter . ' parameter'];
            }
        }
        return ['success' => true];
    }
}