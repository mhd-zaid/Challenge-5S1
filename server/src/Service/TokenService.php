<?php

namespace App\Service;

class TokenService
{
    public function __construct(){}

    public function generateToken(): string
    {
        $token = bin2hex(random_bytes(16));
        return $token;
    }
}
?>