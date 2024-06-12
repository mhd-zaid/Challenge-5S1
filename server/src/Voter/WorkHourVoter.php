<?php

namespace App\Voter;

use App\Entity\WorkHour;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class WorkHourVoter extends Voter
{
    const CREATE = 'CREATE';
    const EDIT = 'EDIT';
    const DELETE = 'DELETE';

     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::CREATE, self::EDIT, self::DELETE])) {
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
            case self::CREATE:
                return $this->canCreate($workHour, $user);
            case self::EDIT:
                return $this->canEdit($workHour, $user);
            case self::DELETE:
                return $this->canDelete($workHour, $user);
        }

        return false;
    }

    private function canCreate(WorkHour $workHour, UserInterface $user): bool
    {
        return $user === $workHour->getEmployee() || in_array('ROLE_ADMIN', $user->getRoles());
    }

    private function canEdit(WorkHour $workHour, UserInterface $user): bool
    {
        return $user === $workHour->getEmployee() || in_array('ROLE_ADMIN', $user->getRoles());
    }

    private function canDelete(WorkHour $workHour, UserInterface $user): bool
    {
        return $user === $workHour->getEmployee() || in_array('ROLE_ADMIN', $user->getRoles());
    }
}