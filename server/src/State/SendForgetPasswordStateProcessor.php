<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;

use App\Service\TokenService;
use App\Repository\UserRepository;
use App\Service\MailService;

use Symfony\Component\HttpFoundation\Response;

class SendForgetPasswordStateProcessor implements ProcessorInterface
{
    public function __construct(TokenService $tokenService, UserRepository $userRepository, MailService $emailService)
    {
        $this->userRepository = $userRepository;
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $user = $this->userRepository->findOneBy(['email' => $data->getEmail()]);

        if (!$user) {
            return new Response('Mail forget password sent!', Response::HTTP_OK);
        }
        $token = $this->tokenService->generateToken();
        $user->setToken($token);
        $this->userRepository->save($user, true);
        $frontendUrl = $_ENV['FRONTEND_URL']; 
        $this->emailService->sendEmail($user, 'Réinitialiser votre mot de passe', 'reset_password.html.twig', [
            'resetLink' => $frontendUrl . '/auth/resetpassword/' . $token,
            'user' => $user 
        ]);
        return new Response('Mail forget password sent!', Response::HTTP_OK);
    }
}
