<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\Security\Core\Security;
use App\Entity\UnavailabilityHour;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;

class UnavailabilityHourStateProvider implements ProviderInterface
{
    public function __construct(private Security $security, private EntityManagerInterface $em)
    {
    }
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        if ($user === null) {
            return null;
        }
        if (in_array('ROLE_EMPLOYEE', $user->getRoles())) {
            return $this->getEmployeeUnavailabilityHour($user);
        }
        // if (in_array('ROLE_ADMIN', $user->getRoles())) {
        //     return $this->getAdminUnavailabilityHour($user);
        // }
        if (in_array('ROLE_PRESTA', $user->getRoles())) {
            return $this->getPrestaUnavailabilityHour($user);
        }
    }

    private function getEmployeeUnavailabilityHour($user): ArrayCollection
    {
        $unavailabilityHours = $this->em->getRepository(UnavailabilityHour::class)->findBy(['employee' => $user->getId()]);

        $unavailabilityHourCollection = new ArrayCollection();

        foreach ($unavailabilityHours as $unavailabilityHour) {
            $unavailabilityHourCollection->add($unavailabilityHour);
        }

        return $unavailabilityHourCollection;
    }

    private function getPrestaUnavailabilityHour($user): ArrayCollection
    {

        $users = $user->getCompany()->getUsers();
        $unavailabilityHourCollection = new ArrayCollection();

        foreach ($users as $user) {

            foreach ($user->getUnavailabilityHours() as $unavailabilityHour) {
                $unavailabilityHourCollection->add($unavailabilityHour);
            }
        }

        return $unavailabilityHourCollection;
    }
}
