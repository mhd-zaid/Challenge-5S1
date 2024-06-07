<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenProvider implements ProviderInterface
{

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Response
    {

        $user = $this->userRepository->findOneBy(['token' => $uriVariables['token']]);

        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }
    
        return new Response('TOKEN OK!', Response::HTTP_OK);
    }
}
