<?php
namespace App\EventSubscriber;

use App\Service\MailService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use App\Entity\Reservation;
use App\Entity\Feedback;
use Doctrine\ORM\EntityManagerInterface;

class ReservationSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailService $emailService, private EntityManagerInterface $entityManager)
    {
    }
    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postUpdate
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

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();

        /** @var Reservation $object */
        if ($object instanceof Reservation) {
            if($object->getStatus() == 'COMPLETED') {
                $this->processFeedback($object);
            } else{
                $this->emailService->sendEmail($object->getCustomer(), 'Réservation annulée', 'cancel_reservation.html.twig', [
                    'reservation' => $object ,
                    'customer' => $object->getCustomer(),
                ]);
            }
        }
    }

    private function processFeedback(Reservation $reservation): void
    {
        $feedback = new Feedback();
        $feedback->setReservation($reservation);
        $feedback->setNote(0);
        $this->entityManager->persist($feedback);
        $this->entityManager->flush();
        $frontendUrl = $_ENV['FRONTEND_URL'];
        $this->emailService->sendEmail($reservation->getCustomer(), 'Feedback', 'feedback.html.twig', [
            'customer' => $reservation->getCustomer(),
            'feedback_link' => $frontendUrl . "/feedback/" . $feedback->getId(),
        ]);
    }   

}
