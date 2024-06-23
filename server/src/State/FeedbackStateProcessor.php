<?php

namespace App\State;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\Feedback;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class FeedbackStateProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em,
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor)
    {
    }

    public function process($data, $operation, array $uriVariables = [], array $context = [])
    {
        if ($data->getReservation()->getCustomer() !== $this->security->getUser()) {
           return UnauthorizedHttpException::class;
        }

        $existingFeedback = $this->em->getRepository(Feedback::class)->findOneBy(['reservation' => $data->getReservation()]);
        if ($existingFeedback != null && $data->getId() == null) {

            return new BadRequestHttpException('Feedback already exists for this reservation');
        }

        if ($data->getId() != null) {
            $unitOfWork = $this->em->getUnitOfWork();
            $unitOfWork->computeChangeSets();
            $changeSet = $unitOfWork->getEntityChangeSet($data);
            if (isset($changeSet['reservation'])) {
                $oldReservation = $changeSet['reservation'][0];
                $newReservation = $changeSet['reservation'][1];
                if ($oldReservation != $newReservation) {
                    return new BadRequestHttpException("You can't update a feedback reservation.");
                }
            }
            
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}