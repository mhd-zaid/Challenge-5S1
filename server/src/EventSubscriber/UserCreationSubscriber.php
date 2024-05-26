<?php

namespace App\EventSubscriber;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Psr\Log\LoggerInterface;
use App\Service\TokenService;
use App\Service\MailService;
// use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class UserCreationSubscriber implements EventSubscriberInterface
{
    public function __construct(TokenService $tokenService, MailService $emailService ,private UserPasswordHasherInterface $passwordHasher,
    private LoggerInterface $logger)
    {
        $this->tokenService = $tokenService;
        $this->logger = $logger;
        $this->emailService = $emailService;
    }

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
            $token = $this->tokenService->generateToken();
            $object->setToken($token);
            $frontendUrl = $_ENV['FRONTEND_URL']; 
            $this->emailService->sendEmail($object, 'Vérifiez votre mail', 'verify_email.html.twig', [
                'verificationUrl' => $frontendUrl . '/auth/verify/' . $token,
                'user' => $object 
            ]);
        }
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {

        // $this->logger->info('lalalala' . $token);

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
