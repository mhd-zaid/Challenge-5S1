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

        //Pour le role presta on set en dur role_employee et pour le role usero ou employee on set role_customer
        //Le role admin pourra mettre ce qu'il veut dans la variable roles

        if($this->security->isGranted('ROLE_PRESTA')){
            $data['roles'] = ['ROLE_EMPLOYEE'];
            $user->setRoles($data['roles']);

            $user->setCompany($this->security->getUser()->getCompany());
            $user->setPlainPassword('Motdepassee123!');
            
        } else if ($this->security->isGranted('ROLE_USER') || $this->security->isGranted('ROLE_EMPLOYEE')) {
            $data['roles'] = ['ROLE_CUSTOMER'];
            $user->setRoles($data['roles']);
        }
        return $user;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return User::class === $type && (strtoupper($context['operation']->getMethod()) === 'POST' || strtoupper($context['operation']->getMethod()) === 'PATCH') && "/api/users" === $context['request_uri'];
    }
}
