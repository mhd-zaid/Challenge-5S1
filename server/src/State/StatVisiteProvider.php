<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use App\Repository\StatRepository;
use ApiPlatform\State\ProviderInterface;

Class StatVisiteProvider implements ProviderInterface
{
    public function __construct(private StatRepository $statRepository)
    {
        $this->statRepository = $statRepository;
    }
    
    public function provide(Operation $operation, array $uriVariables = [], array $context = []) : object|array|null
    {
        $studioId = $uriVariables['id'];

        $stats = $this->statRepository->findBy(['studio' => $studioId]);

        return $this->getStats($stats);
    }

    private function getStats(array $stats): array
    {
        $counts = [];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        foreach ($stats as $stat) {
            $date = $stat->getDate();
            $year = $date->format('Y');
            $monthIndex = (int)$date->format('n') - 1;
    
            if (!isset($counts[$year])) {
                $counts[$year] = ['year' => $year, 'total' => 0, 'months' => array_fill_keys($monthNames, 0)];
            }
            
            $counts[$year]['total']++;
            $counts[$year]['months'][$monthNames[$monthIndex]]++;
        }
    
        krsort($counts);
    
        return $counts;
    }
    
}