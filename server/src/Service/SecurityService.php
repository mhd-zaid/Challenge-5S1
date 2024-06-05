<?php

namespace App\Service;

use Symfony\Component\Security\Core\Security;
use App\Entity\User;

class SecurityService {
    public function __construct(private Security $security) {
        $this->security = $security;
    }

    public function securityToken(): User|null
    {
        $user = $this->security->getUser();

        if (!$user) {
            return null;
        }
        return $user;
    }
}
?>