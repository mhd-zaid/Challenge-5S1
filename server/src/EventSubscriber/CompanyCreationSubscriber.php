<?php

namespace App\EventSubscriber;

use App\Entity\Company;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use App\Service\MailService;
use Psr\Log\LoggerInterface;

class CompanyCreationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private MailService $emailService
        , private EntityManagerInterface $em
    )
    {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();
        $adminList = $this->em->getRepository(User::class)->findByRole('ROLE_ADMIN');
        $frontendUrl = $_ENV['FRONTEND_URL'];


        if ($object instanceof Company) {
//            dd($object ,$adminList);
            foreach ($adminList as $admin) {
                $this->emailService->sendEmail($admin
                    , 'Nouvelle demande de création de compte'
                    , 'company_request.html.twig'
                    , [
                        'company' => $object
                        , 'verificationUrl' => $frontendUrl . '/admin/prestataires-demandes'
                        , 'recipient' => $admin
                    ]
                );
            }
        }
    }

}
