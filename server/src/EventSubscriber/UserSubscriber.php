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
use Doctrine\ORM\EntityManagerInterface;

class UserSubscriber implements EventSubscriberInterface
{
    public function __construct(private TokenService $tokenService, private MailService $emailService ,private UserPasswordHasherInterface $passwordHasher,
    private LoggerInterface $logger, private EntityManagerInterface $entityManager)
    {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
            Events::postUpdate,
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

        $object = $args->getObject();

        /** @var User $object */
        if ($object instanceof User) {
            $this->updatePassword($object);
        }
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var User $object */
        if ($object instanceof User) {
            if($object->getDeletedAt()) $this->removeUser($object);
        }
    }

    private function updatePassword(User $object): void
    {
        if ($object->getPlainPassword()) {
            $object->setPassword($this->passwordHasher->hashPassword($object, $object->getPlainPassword()));
        }
    }
    
    private function removeUser(User $object): void
    {
        if(in_array('ROLE_PRESTA', $object->getRoles())) {
            foreach($object->getCompany()->getUsers() as $user) {
                $this->processRemove($user);
            }

            $studios = $object->getCompany()->getStudios();
            foreach ($studios as $studio) {
                $studio->setDeletedAt(new \DateTime());
                $this->entityManager->persist($studio);
                $this->entityManager->flush();
            }

            $company = $object->getCompany();
            $company->setDeletedAt(new \DateTime());
            $company->setStatus('deleted');
            $this->entityManager->persist($company);
            $this->entityManager->flush();
            $this->processRemove($object);
        }else{
            $this->processRemove($object);
        }
    }

    private function processRemove(User $object): void
    {
        if (!$this->isEmailHashed($object->getEmail())) {

        $object->setFirstname($object->getFirstname() . ' (deleted)');
        $object->setLastname($object->getLastname() . ' (deleted)');
        $object->setEmail($this->hashEmail($object->getEmail()));
        $object->setDeletedAt(new \DateTime());

        $hashedPassword = $this->passwordHasher->hashPassword($object, uniqid());
        $object->setPassword($hashedPassword);

        $this->entityManager->persist($object);
        $this->entityManager->flush();
        

        foreach ($object->getReservations() as $reservation) {
            if($reservation->getStatus() === 'RESERVED') {
                $reservation->setStatus('CANCELED');
                $reservation->setDeletedAt(new \DateTime());
                $this->entityManager->persist($reservation);
                $this->entityManager->flush();        
            }
        }

        foreach ($object->getUnavailabilityHours() as $unavailabilityHour) {
            $unavailabilityHour->setDeletedAt(new \DateTime());
            $this->entityManager->persist($unavailabilityHour);
            $this->entityManager->flush();    
        }

        foreach($object->getWorkHours() as $workHour) {
            $workHour->setDeletedAt(new \DateTime());
            $this->entityManager->persist($workHour);
            $this->entityManager->flush();    
        }
    }

    }

    private function hashEmail(string $email): string
    {
        return 'hashed_' . hash('sha256', $email);
    }

    private function isEmailHashed(string $email): bool
    {
        return str_starts_with($email, 'hashed_');
    }
}
