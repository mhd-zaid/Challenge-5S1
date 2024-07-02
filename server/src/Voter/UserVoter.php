<?php

namespace App\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class UserVoter extends Voter
{
    const CAN_CREATE = 'CAN_CREATE';
    const CAN_EDIT = 'CAN_EDIT';

     protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::CAN_CREATE, self::CAN_EDIT ])) {
            return false;
        }

        if (!$subject instanceof User) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $userData = $subject;

        switch ($attribute) {
            case self::CAN_CREATE:
                return $this->canCreate($userData, $token);
            case self::CAN_EDIT:
                return $this->canEdit($userData, $token);
        }

        return false;
    }

    private function canCreate(User $userData, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if(!$user) return true;

        // Je ne peux pas créer de user en tant que client ou employee
        if(in_array("ROLE_CUSTOMER", $user->getRoles())
            || in_array("ROLE_EMPLOYEE", $user->getRoles())){
            return false;
        }
        // Je ne peux pas créer un prestataire via l'opération POST de user
        if(in_array("ROLE_PRESTA", $userData->getRoles())) {
            return false;
        } 
        // Je ne peux pas créer un employé sans company
        else if(in_array("ROLE_EMPLOYEE", $userData->getRoles()) && $userData->getCompany() === null) {
            return false;
        } 
        // Je ne peux pas créer un client ou un admin avec une company
        else if ((in_array("ROLE_CUSTOMER", $userData->getRoles()) 
            || in_array("ROLE_ADMIN", $userData->getRoles())) && $userData->getCompany() !== null){
            return false;
        }
        return true;
    }

    private function canEdit(User $user, TokenInterface $token):bool 
    {
      $userConnected = $token->getUser();

      if (!$userConnected instanceof UserInterface) {
        return false;
    }

      return in_array("ROLE_ADMIN", $userConnected->getRoles())
      || (in_array("ROLE_PRESTA", $userConnected->getRoles()) && $user->getCompany()->getOwner() === $userConnected)
      || $userConnected === $user;   
    }
}