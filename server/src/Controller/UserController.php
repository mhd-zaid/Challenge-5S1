<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Service\TokenService;
use App\Service\MailService;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;

class UserController extends AbstractController
{

    public function __construct(TokenService $tokenService, MailService $emailService, private LoggerInterface $logger)
    {
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
        $this->logger = $logger;
    }

    #[Route('/api/users/verify-email/{token}', name: 'verify_email', methods: ['GET'])]
    public function verifyEmail(Request $request, EntityManagerInterface $entityManager): Response
{
    $token = $request->attributes->get('token');

    $user = $entityManager->getRepository(User::class)->findOneBy(['token' => $token]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    if ($user->getIsValidated()) {
        return new Response('Account already verified', Response::HTTP_OK);
    }

    $user->setIsValidated(true);
    $entityManager->flush();

    return new Response('Email verified!', Response::HTTP_OK);
}

#[Route('/api/users/send-email-verification/{email}', name: 'send_email_verification', methods: ['GET'])]
    public function sendEmailVerification(Request $request, EntityManagerInterface $entityManager): Response
{
    $email = $request->attributes->get('email');

    $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    if ($user->getIsValidated()) {
        return new Response('Account already verified', Response::HTTP_OK);
    }

    $token = $this->tokenService->generateToken();
    $user->setToken($token);
    $entityManager->flush();
    $this->emailService->sendValidationEmail($user, $token);

    return new Response('Email send back!', Response::HTTP_OK);
}

#[Route('/api/users/forget-password/{email}', name: 'forget_password', methods: ['GET'])]
    public function forgetPassword(Request $request, EntityManagerInterface $entityManager): Response
{
    $email = $request->attributes->get('email');

    $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    $token = $this->tokenService->generateToken();
    $user->setToken($token);
    $entityManager->flush();
    $this->emailService->forgetPassword($user, $token);

    return new Response('Email send back!', Response::HTTP_OK);
}

#[Route('/api/users/check-token/{token}', name: 'forget_password', methods: ['GET'])]
    public function checkToken(Request $request, EntityManagerInterface $entityManager): Response
{
    $token = $request->attributes->get('token');

    $user = $entityManager->getRepository(User::class)->findOneBy(['token' => $token]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    return new Response('TOKEN OK!', Response::HTTP_OK);
}

#[Route('/api/users/reset-password/{token}', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(Request $request, UserRepository $userRepository): Response
{
    $token = $request->attributes->get('token');
    $this->logger->info('TOEKn ' . $token);
    $payload = json_decode($request->getContent(), true);

    $this->logger->info('PAYLOAD ' . $payload['password']);

    $user = $userRepository->findOneBy(['token' => $token]);

    if (!$user) {
        return new Response('User not found', Response::HTTP_NOT_FOUND);
    }

    $newPassword = $request->request->get('password');

    // Mettre à jour le mot de passe de l'utilisateur
    $user->setPlainPassword($payload['password']);

    $this->logger->info('lalalalapass ' . $payload['password']);
    $this->logger->info('email ' . $user->getEmail());

    // $this->logger->error('Error sending validation email: ' . $e->getMessage());

    // Persist and flush changes to trigger preUpdate event
    // $userRepository->persist($user);
    // $userRepository->flush();
    $userRepository->save($user, true);


    return new Response('Password updated!', Response::HTTP_OK);
}

}
