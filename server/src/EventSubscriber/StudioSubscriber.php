<?php
namespace App\EventSubscriber;

use App\Service\MailService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;
use App\Entity\Reservation;
use App\Entity\Studio;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreUpdateEventArgs;

class StudioSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailService $emailService, private EntityManagerInterface $entityManager)
    {
    }
    public function getSubscribedEvents()
    {
        return [
            Events::preUpdate
        ];
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var Studio $object */
        if ($object instanceof Studio) {
            if($args->hasChangedField('deletedAt')) {
                $this->deleteStudio($object);
            }
        }
    }

    private function deleteStudio(Studio $studio): void
    {
        $reservations = $studio->getReservations();
        foreach ($reservations as $reservation) {
            if($reservation->getStatus() === 'RESERVED') {
                $reservation->setStatus('CANCELED');
                $reservation->setDeletedAt(new \DateTime());
                $this->entityManager->persist($reservation);
                $this->entityManager->flush();        
            }
        }

        $workHours = $studio->getWorkHours();
        foreach ($workHours as $workHour) {
            $workHour->setDeletedAt(new \DateTime());
            $this->entityManager->persist($workHour);
            $this->entityManager->flush();
        }
    }   

}
