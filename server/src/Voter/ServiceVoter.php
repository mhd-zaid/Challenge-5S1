<?php

namespace App\Voter;

use App\Entity\Service;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class ServiceVoter extends Voter
{
    const AUTHORIZE = 'AUTHORIZE';

     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::AUTHORIZE ])) {
            return false;
        }

        if (!$subject instanceof Service) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        $service = $subject;

        switch ($attribute) {
            case self::AUTHORIZE:
                return $this->canAuthorize($service, $user);
        }

        return false;
    }

    private function canAuthorize(Service $service, UserInterface $user): bool
    {
        return($service->getStudio()->getCompany()->getOwner() === $user);
    }

}