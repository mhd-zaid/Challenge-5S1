<?php

namespace App\Voter;

use App\Entity\Company;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class CompanyVoter extends Voter
{

    const CREATE = 'CREATE';
    const READ = 'READ';
    const UPDATE = 'UPDATE';
    const DELETE = 'DELETE';
    protected function supports(string $attribute, mixed $subject): bool
    {
        if(!in_array($attribute, [ self::CREATE, self::READ, self::UPDATE, self::DELETE ])){
            return false;
        }


        if(!$subject instanceof Company){
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();


        $company = $subject;

        if($attribute === self::READ){
            return $this->canRead($company, $user);
        }

        if($attribute === self::UPDATE){
            return $this->canUpdate($company, $user);
        }

        if($attribute === self::DELETE){
            return $this->canDelete($company, $user);
        }

        return false;
    }

    private function canUpdate(Company $company, UserInterface $user): bool
    {
        return $user->getRoles() === ['ROLE_ADMIN'] || ($user === $company->getOwner() && $user->getRoles() === ['ROLE_PRESTA']);
    }

    private function canDelete(Company $company, UserInterface $user): bool
    {
        return $user->getRoles() === ['ROLE_ADMIN'];
    }

}