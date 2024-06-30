<?php

namespace App\Voter;

use App\Entity\Reservation;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class ReservationVoter extends Voter
{
    const AUTHORIZE = 'AUTHORIZE';

    const EDIT = 'EDIT';


     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::AUTHORIZE, self::EDIT ])) {
            return false;
        }

        if (!$subject instanceof Reservation) {
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

        $reservation = $subject;

        switch ($attribute) {
            case self::AUTHORIZE:
                return $this->canAuthorize($reservation, $user);
            case self::EDIT:
                return $this->canEdit($reservation, $user);
        }

        return false;
    }

    private function canAuthorize(Reservation $reservation, UserInterface $user): bool
    {
        return($reservation->getCustomer() === $user);
    }

    private function canEdit(Reservation $reservation, UserInterface $user): bool
    {
        return(($reservation->getCustomer() === $user 
        || $reservation->getEmployee() === $user 
        || $reservation->getEmployee()->getCompany()->getOwner() === $user));
    }
}