<?php
namespace App\EventSubscriber;

use App\Entity\StudioOpeningTime;
use App\Service\MailService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;
use App\Entity\Reservation;
use App\Entity\Studio;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use App\Entity\StudioOpeningTimes;	

class StudioSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailService $emailService, private EntityManagerInterface $entityManager)
    {
    }
    public function getSubscribedEvents()
    {
        return [
            Events::preUpdate,
            Events::postPersist
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

    public function postPersist(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var Studio $object */
        if ($object instanceof Studio) {
            for ($i = 0; $i < 7; $i++) {
                $openingTime = new StudioOpeningTime();
                $openingTime->setDay($i);
                $openingTime->setStudio($object);
                $openingTime->setStartTime(new \DateTime('00:00:00'));
                $openingTime->setEndTime(new \DateTime('00:00:00'));
                $this->entityManager->persist($openingTime);
            }
            $this->entityManager->flush();
            
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
