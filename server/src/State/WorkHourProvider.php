<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\WorkHourRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class WorkHourProvider implements ProviderInterface
{
    public function __construct(private LoggerInterface $logger, private WorkHourRepository $workHourRepository,private UserRepository $userRepository)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []):  object|array|null
    {
        $uriVariables['employee'] ?? null;

        $employee = $this->userRepository->find($uriVariables['employee']);

        if (!$employee) {
            $this->logger->error('Employee not found', ['employee' => $uriVariables['employee']]);
            throw new BadRequestHttpException('Employee not found');
        }
        
        return $this->workHourRepository->findByEmployee($employee->getId());

    }
}
