<?php

namespace App\Voter;

use App\Entity\WorkHour;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class WorkHourVoter extends Voter
{
    const AUTHORIZE = 'AUTHORIZE';
     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::AUTHORIZE])) {
            return false;
        }

        if (!$subject instanceof WorkHour) {
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

        $workHour = $subject;

        switch ($attribute) {
            case self::AUTHORIZE:
                return $this->canAuthorize($workHour, $user);
        }

        return false;
    }

    private function canAuthorize(WorkHour $workHour, UserInterface $user): bool
    {
        return (in_array('ROLE_PRESTA',$user->getRoles()) && $user === $workHour->getEmployee()->getCompany()->getOwner()) || in_array('ROLE_ADMIN', $user->getRoles());
    }
}