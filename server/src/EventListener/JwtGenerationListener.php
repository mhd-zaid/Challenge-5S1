<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class JwtGenerationListener
{
    #[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created')]
    public function onLexikJwtAuthenticationOnJwtCreated($event): void
    {
        $user = $event->getUser();
        if (!$user->getIsValidated()) {
            throw new AccessDeniedHttpException('User is not validated');
        }

        if($user->getCompany() !== null)
        {
            if($user->getCompany()->getStatus() !== 'accepted') {
                throw new AccessDeniedHttpException('Company is not active');
            }
        }
    }
}
