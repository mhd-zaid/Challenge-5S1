<?php
namespace App\EventSubscriber;

use App\Entity\WorkHour;
use App\Service\MailService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use App\Entity\StudioOpeningTime;
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

        /** @var StudioOpeningTime $object */
        if ($object instanceof StudioOpeningTime) {
            if($args->hasChangedField('deletedAt')) {
                $this->processDeleteStudioOpeningTime($object);
            }
        }
    }

    public function processDeleteStudioOpeningTime(StudioOpeningTime $studioOpeningTime): void
    {
        $day = $studioOpeningTime->getDay();
        $studio = $studioOpeningTime->getStudio();

        $workHours = $this->entityManager->getRepository(WorkHour::class)->createQueryBuilder('wh')
            ->where('wh.studio = :studio')
            ->andWhere('DAYOFWEEK(wh.startTime) = :day')
            ->andWhere('wh.startTime > :now')
            ->setParameter('studio', $studio)
            ->setParameter('day', $day)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();

        foreach ($workHours as $workHour) {
            $reservations = $workHour->getReservations();
            foreach ($reservations as $reservation) {
                if($reservation->getStatus() === 'RESERVED') {
                    $reservation->setStatus('CANCELED');
                    $reservation->setDeletedAt(new \DateTime());
                    $this->entityManager->persist($reservation);
                    $this->entityManager->flush();        
                }
            }
            $workHour->setDeletedAt(new \DateTime());
            $this->entityManager->persist($workHour);
            $this->entityManager->flush();
        }
    }
}
