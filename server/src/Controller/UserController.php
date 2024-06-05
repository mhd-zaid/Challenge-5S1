<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Service\TokenService;
use App\Service\MailService;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\SecurityService;
use App\Entity\User;

#[AsController]
class UserController extends AbstractController
{
    public function __construct(SecurityService $securityService ,TokenService $tokenService, MailService $emailService, private LoggerInterface $logger, UserRepository $userRepository) 
    {
        $this->logger = $logger;
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
        $this->userRepository = $userRepository;
        $this->securityService = $securityService;
    }

    public function __invoke(string $token): Response
    {
        $this->logger->info('Verifying email with token: ' . $token);
        $user = $this->userRepository->findOneBy(['token' => $token]);

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

    public function verify_email(string $email): Response
    {

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
    return new Response('Email send back!', Response::HTTP_OK);
    }

    public function forgetPassword(string $email): Response
    {    
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
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

    public function checkToken(string $token): Response
    {

    $user = $this->userRepository->findOneBy(['token' => $token]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    return new Response('TOKEN OK!', Response::HTTP_OK);
    }

    public function me(): Response
    {
        $user = $this->securityService->securityToken();
        if(!$user){
            return new Response('Utilisateur non authentifié', Response::HTTP_UNAUTHORIZED);
        }

        $responseData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'phone' => $user->getPhone(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
        ];

        $response = new Response(json_encode($responseData));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function resetPassword(Request $request, string $token): Response
    {
        $payload = json_decode($request->getContent(), true);
        $user = $this->userRepository->findOneBy(['token' => $token]);
    
        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }
    
        $newPassword = $request->request->get('password');
    
        $user->setPlainPassword($payload['password']);
    
        $token = $this->tokenService->generateToken();
        $user->setToken($token);
        $this->userRepository->save($user, true);
    
        $this->emailService->sendEmail($user, 'Mot de passe modifié', 'password_reset_success.html.twig', []);
        return new Response('Password updated!', Response::HTTP_OK);
    }

    public function register(Request $request): void
    {
        $payload = json_decode($request->getContent(), true);

        $user = new User();
        $user->setPlainPassword($payload['password']);
        $user->setEmail($payload['email']);
        $user->setIsValidated(false);
        $user->setRoles(['ROLE_CUSTOMER']);
        $user->setPhone($payload['phone']);
        $user->setFirstname($payload['firstname']);
        $user->setLastname($payload['lastname']);    
        $this->userRepository->save($user, true);
    }
}