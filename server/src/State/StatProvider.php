<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\CompanyRepository;
use App\Repository\ReservationRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

Class StatProvider implements ProviderInterface
{
    public function __construct(private CompanyRepository $companyRepository,private ReservationRepository $reservationRepository, private Security $security)
    {

    }
    
    public function provide(Operation $operation, array $uriVariables = [], array $context = []) : object|array|null
    {
        $user = $this->security->getUser();
        
        if ($user === null || !in_array('ROLE_ADMIN', $user?->getRoles())){
            throw new AccessDeniedHttpException();
        }
        
        $companies = $this->companyRepository->findBy(['status' => 'accepted','deletedAt' => null]);

        return $this->getStats($companies);
    }

    private function getStats(array $companies): array
    {
        $counts = [];
        foreach ($companies as $company) {
            $companyName = $company->getName();
            $counts[$companyName] = [
                'name' => $companyName,
                'years' => [],
            ];
            $employees = $company->getUsers();
            foreach ($employees as $employee) {
                $reservations = $this->reservationRepository->findByEmployee($employee);
                foreach ($reservations as $reservation) {
                    $year = $reservation->getDate()->format('Y');
                    if (!isset($counts[$companyName]['years'][$year])) {
                        $counts[$companyName]['years'][$year] = [
                            'year' => $year,
                            'totalCA' => 0,
                        ];
                    }
                    if($reservation->getStatus() === 'COMPLETED') {
                        $counts[$companyName]['years'][$year]['totalCA'] += $reservation->getService()->getCost();
                    }
                }
            }
        }

        foreach ($counts as &$companyData) {
            krsort($companyData['years']);
        }

        return $counts;
    }
    
}