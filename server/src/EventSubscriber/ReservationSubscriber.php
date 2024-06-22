<?php
namespace App\EventSubscriber;

use App\Service\MailService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use App\Entity\Reservation;

class ReservationSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailService $emailService)
    {
    }
    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var Reservation $object */
        if ($object instanceof Reservation) {
            $this->emailService->sendEmail($object->getEmployee()->getCompany()->getOwner(), 'Nouvelle réservation', 'new_reservation.html.twig', [
                'reservation' => $object 
            ]);
        }
    }

}
