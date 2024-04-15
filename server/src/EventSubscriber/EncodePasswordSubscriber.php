<?php

namespace App\EventSubscriber;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Psr\Log\LoggerInterface;

class EncodePasswordSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerInterface $logger
    ) {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var User $object */
        if ($object instanceof User) {
            $this->updatePassword($object);
        }
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var User $object */
        if ($object instanceof User) {
            $this->updatePassword($object);
        }
    }

    private function updatePassword(User $object): void
    {   
        if ($object->getPlainPassword()) {
            $object->setPassword($this->passwordHasher->hashPassword($object, $object->getPlainPassword()));
        }
    }
}
