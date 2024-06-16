<?php

namespace App\Voter;

use App\Entity\UnavailabilityHour;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class UnavailabilityHourVoter extends Voter
{
    const AUTHORIZE = 'AUTHORIZE';

     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::AUTHORIZE])) {
            return false;
        }

        if (!$subject instanceof UnavailabilityHour) {
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

        $unavailabilityHour = $subject;

        switch ($attribute) {
            case self::AUTHORIZE:
                return $this->canAuthorize($unavailabilityHour, $user);
        }

        return false;
    }

    private function canAuthorize(UnavailabilityHour $unavailabilityHour, UserInterface $user): bool
    {
        return $user === $unavailabilityHour->getEmployee() || $user === $unavailabilityHour->getEmployee()->getCompany()->getOwner() || in_array('ROLE_ADMIN', $user->getRoles());
    }
}