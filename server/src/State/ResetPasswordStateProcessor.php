<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;

use App\Service\TokenService;
use App\Service\MailService;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class ResetPasswordStateProcessor implements ProcessorInterface
{
    public function __construct(
        private UserRepository $userRepository, 
        private TokenService $tokenService, 
        private MailService $emailService
        )
    {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $user = $this->userRepository->findOneBy(['token' => $data->getToken()]);
    
        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }
        
        $user->setPlainPassword($data->getPassword());
    
        $token = $this->tokenService->generateToken();
        $user->setToken($token);
        $this->userRepository->save($user, true);
    
        $this->emailService->sendEmail($user, 'Mot de passe modifié', 'password_reset_success.html.twig', []);
        return new Response(Response::HTTP_OK);    
    }
}
