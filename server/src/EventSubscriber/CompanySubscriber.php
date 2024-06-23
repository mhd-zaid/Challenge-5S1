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

class CompanySubscriber implements EventSubscriberInterface
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
            Events::postUpdate,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();
        $adminList = $this->em->getRepository(User::class)->findByRole('ROLE_ADMIN');
        $frontendUrl = $_ENV['FRONTEND_URL'];


        if ($object instanceof Company) {
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

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();
        $frontendUrl = $_ENV['FRONTEND_URL'];

        if ($object instanceof Company) {
            $this->emailService->sendEmail($object->getOwner()
                , 'Modification de compte'
                , 'company_info_updated.html.twig'
                , [
                    'company' => $object
                    , 'loginUrl' => $frontendUrl . '/auth/login'
                ]
            );
        }
    }

}
