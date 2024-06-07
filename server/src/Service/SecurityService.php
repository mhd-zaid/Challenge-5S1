<?php

namespace App\Service;

use Symfony\Component\Security\Core\Security;
use App\Entity\User;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class SecurityService {
    public function __construct(private Security $security) {
        $this->security = $security;
    }

    public function securityToken(): User|null 
    {
        $user = $this->security->getUser();

        if (!$user) {
            throw new AccessDeniedHttpException('User is not validated');
        }
        return $user;
    }
}
?>