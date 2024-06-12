<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Studio;
use App\Entity\UnavailabilityHour;
use App\Entity\User;
use App\Entity\WorkHour;
use App\Repository\StudioRepository;
use App\Repository\UnavailabilityHourRepository;
use App\Repository\UserRepository;
use App\Repository\WorkHourRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Bundle\SecurityBundle\Security;

class PlanningProvider implements ProviderInterface
{
    public function __construct(
        private LoggerInterface $logger, 
        private Security $security,
        private EntityManagerInterface $em,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []):  object|array|null
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            throw new BadRequestHttpException('User not found');
        }
        if(in_array('ROLE_ADMIN', $user->getRoles()))
            return $this->getAdminPlanning($user);
        if(in_array('ROLE_PRESTA', $user->getRoles()))
            return $this->getPrestaPlanning($user);
        
        if(in_array('ROLE_EMPLOYEE', $user->getRoles()))
            return $this->getEmployeePlanning($user);


    }

    /**
     *  Récupère le planning d'un employé
     * @param User $user
     * @return array
     */
    private function getEmployeePlanning(User $user): array
    {
        $workHours = $this->em->getRepository(WorkHour::class)->findBy(['employee' => $user->getId()]);
        $unavailabilityHours = $this->em->getRepository(UnavailabilityHour::class)->findBy(['employee' => $user->getId()]);

        $planning = [];

        foreach ($workHours as $workHour) {
            $planning[] = [
                'type' => 'workHour',
                'startTime' => $workHour->getStartTime(),
                'endTime' => $workHour->getEndTime(),
                'studio' => $workHour->getStudio(),
            ];
        }

        foreach ($unavailabilityHours as $unavailabilityHour) {
            $planning[] = [
                'type' => 'unavailabilityHour',
                'startTime' => $unavailabilityHour->getStartTime(),
                'endTime' => $unavailabilityHour->getEndTime(),
                'studio' => $unavailabilityHour->getStudio(),
            ];
        }

        return $planning;
    }

    /**
     * Récupère le planning de tout les employés d'une entreprise
     * @param User $user
     * @return array
     */
    private function getPrestaPlanning(User $user): array
    {
        $studios = $user->getCompany()->getStudios();
        $users = $user->getCompany()->getUsers();
        $workHours = new ArrayCollection();
        foreach ($studios as $studio) {
            foreach ($studio->getWorkHours() as $workHour) {
                $workHours->add($workHour);
            }
        }
        $unavailabilityHours = new ArrayCollection();
        foreach ($users as $user) {
            foreach ($user->getUnavailabilityHours() as $unavailabilityHour) {
                $unavailabilityHours->add($unavailabilityHour);
            }
        }

        $planning = [];

        foreach ($workHours as $workHour) {
            $planning[] = [
                'type' => 'workHour',
                'startTime' => $workHour->getStartTime(),
                'endTime' => $workHour->getEndTime(),
                'studio' => $workHour->getStudio(),
            ];
        }

        foreach ($unavailabilityHours as $unavailabilityHour) {
            $planning[] = [
                'type' => 'unavailabilityHour',
                'startTime' => $unavailabilityHour->getStartTime(),
                'endTime' => $unavailabilityHour->getEndTime(),
                'studio' => $unavailabilityHour->getStudio(),
            ];
        }

        return $planning;
    }

    /**
     * Récupère le planning de tout les employés de tout les studios de tout les entreprise
     * @param User $user
     * @return array
     */
    private function getAdminPlanning(User $user): array
    {
        $studios = $this->em->getRepository(Studio::class)->findAll();
        $users = $this->em->getRepository(User::class)->findAll();
        $workHours = new ArrayCollection();
        foreach ($studios as $studio) {
            foreach ($studio->getWorkHours() as $workHour) {
                $workHours->add($workHour);
            }
        }
        $unavailabilityHours = new ArrayCollection();
        foreach ($users as $user) {
            foreach ($user->getUnavailabilityHours() as $unavailabilityHour) {
                $unavailabilityHours->add($unavailabilityHour);
            }
        }

        $planning = [];

        foreach ($workHours as $workHour) {
            $planning[] = [
                'type' => 'workHour',
                'startTime' => $workHour->getStartTime(),
                'endTime' => $workHour->getEndTime(),
                'studio' => $workHour->getStudio(),
            ];
        }

        foreach ($unavailabilityHours as $unavailabilityHour) {
            $planning[] = [
                'type' => 'unavailabilityHour',
                'startTime' => $unavailabilityHour->getStartTime(),
                'endTime' => $unavailabilityHour->getEndTime(),
                'studio' => $unavailabilityHour->getStudio(),
            ];
        }

        return $planning;
    }
}
