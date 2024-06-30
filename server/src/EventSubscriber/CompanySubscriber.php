<?php

namespace App\EventSubscriber;

use App\Entity\Company;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use App\Service\MailService;
use Psr\Log\LoggerInterface;

class CompanySubscriber implements EventSubscriberInterface
{
    private ?Company $updatedCompany = null;
    private ?string $updatedField = null;
    private ?bool $status = null;

    public function __construct(
        private MailService $emailService
        , private EntityManagerInterface $em
    ){}

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::preUpdate,
            Events::postFlush
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

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $object = $args->getObject();

        if ($object instanceof Company) {
            $this->updatedCompany = $object;

            if ($args->hasChangedField('status')) {
                $this->status = $args->getNewValue('status');
            }
        }
    }

    public function postFlush(PostFlushEventArgs $args): void
    {
        if ($this->updatedCompany) {
            $frontendUrl = $_ENV['FRONTEND_URL'];

          if($this->status != null) {
            if ($this->status === 'accepted') {
                    $this->emailService->sendEmail($this->updatedCompany->getOwner()
                        , 'Votre compte a été vérifié'
                        , 'company_verified.html.twig'
                        , [
                            'company' => $this->updatedCompany
                            , 'loginUrl' => $frontendUrl . '/auth/login'
                        ]
                    );
                } else if ($this->status === 'refused') {
                    $this->emailService->sendEmail($this->updatedCompany->getOwner()
                        , 'Votre compte a été refusé'
                        , 'company_unverified.html.twig'
                        , [
                            'company' => $this->updatedCompany
                            , 'loginUrl' => $frontendUrl . '/auth/login'
                        ]
                    );
                } else if ($this->status === 'deleted') {
                    $this->emailService->sendEmail($this->updatedCompany->getOwner(), 
                    'Votre compte a été supprimé',
                    'company_deleted.html.twig', 
                    []
                    );
                
                }
            }
            $this->updatedCompany = null;
            $this->status = null;
        }
    }
}
