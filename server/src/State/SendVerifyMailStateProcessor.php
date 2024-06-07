<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Psr\Log\LoggerInterface;

use App\Service\TokenService;
use App\Service\MailService;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class SendVerifyMailStateProcessor implements ProcessorInterface
{
    public function __construct(private LoggerInterface $logger, TokenService $tokenService, MailService $emailService, UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {

        $email = $data->getEmail();
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }

        if ($user->getIsValidated()) {
            return new Response('Account already verified', Response::HTTP_OK);
        }

        $token = $this->tokenService->generateToken();
        $user->setToken($token);
        $this->userRepository->save($user, true);
        $frontendUrl = $_ENV['FRONTEND_URL']; 
        $this->emailService->sendEmail($user, 'Vérifiez votre mail', 'verify_email.html.twig', [
            'verificationUrl' => $frontendUrl . '/auth/verify/' . $token,
            'user' => $user 
        ]);
        return new Response('Email sent', Response::HTTP_OK);
    }
}
