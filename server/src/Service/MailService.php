<?php
namespace App\Service;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Psr\Log\LoggerInterface;

class MailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer, LoggerInterface $logger)
    {
        $this->mailer = $mailer;
        $this->logger = $logger;
    }

    public function sendValidationEmail(User $user, string $token): void
    {
        $this->logger->info('Sending validation email to ' . $user->getEmail());
        $message = (new Email())
            ->from('instantstudioesgi@gmail.com')
            ->to($user->getEmail())
            ->subject('Validation de compte')
            ->html('<p>Bonjour ' . $user->getFirstName() . ',</p>' .
                   '<p>Veuillez cliquer sur le lien ci-dessous pour valider votre compte :</p>' .
                   '<a href="https://example.com/validation?token=' . $token . '">Valider mon compte</a>' .
                   '<p>Merci !</p>');
            try {
                $this->mailer->send($message);
            } catch (\Throwable $e) {
                $this->logger->error('Error sending validation email: ' . $e->getMessage());
                throw $e;
            }
    }

    public function forgetPassword(User $user, string $token): void
    {
        $this->logger->info('Sending validation email to ' . $user->getEmail());
        $message = (new Email())
            ->from('instantstudioesgi@gmail.com')
            ->to($user->getEmail())
            ->subject('Mot de passe oublié')
            ->html('<p>Bonjour ' . $user->getFirstName() . ',</p>' .
                   '<p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>' .
                   '<a href="https://example.com/forget-password?token=' . $token . '">Réinitialiser mon mot de passe</a>' .
                   '<p>Merci !</p>');
            try {
                $this->mailer->send($message);
            } catch (\Throwable $e) {
                $this->logger->error('Error sending validation email: ' . $e->getMessage());
                throw $e;
            }
    }
}
?>