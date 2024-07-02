<?php

namespace App\Serializer;

use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Security;

class UserDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;
    public function __construct(
        protected ObjectNormalizer $normalizer,
        protected Security $security
    )
    {}
        
    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $user = $this->normalizer->denormalize($data, $class, $format, $context);

        if ($this->security->isGranted('ROLE_ADMIN')) {
            $user->setPlainPassword($_ENV['PWD_ADMIN_CREATION']);
            $user->setRoles([$data['roles']]);
        } 
        else if($this->security->isGranted('ROLE_PRESTA')){
            $user->setRoles(['ROLE_EMPLOYEE']);
            $user->setCompany($this->security->getUser()->getCompany());
            $password_employee = ucfirst($this->security->getUser()->getCompany()->getName()).'company2024!';
            $user->setPlainPassword(trim($password_employee, ' '));
        }  
        return $user;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return User::class === $type && strtoupper($context['operation']->getMethod()) === 'POST' && "/api/users" === $context['request_uri'];
    }
}
