<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;

use App\Service\TokenService;
use App\Repository\UserRepository;

use Symfony\Component\HttpFoundation\Response;
class VerifyMailStateProcessor implements ProcessorInterface
{

    public function __construct(TokenService $tokenService, UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
        $this->tokenService = $tokenService;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $user = $this->userRepository->findOneBy(['token' => $data->getToken()]);

        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }
    
        if ($user->getIsValidated()) {
            return new Response('Account already verified', Response::HTTP_OK);
        }
    
        $user->setIsValidated(true);
    
        $token = $this->tokenService->generateToken();
        $user->setToken($token);
        $this->userRepository->save($user, true);
        return new Response('Email verified!', Response::HTTP_OK);
    }
}
