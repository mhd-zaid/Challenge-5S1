<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenStateProcessor implements ProcessorInterface
{

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $user = $this->userRepository->findOneBy(['token' => $data->getToken()]);

        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }
    
        return new Response('TOKEN OK!', Response::HTTP_OK);
    }
}
