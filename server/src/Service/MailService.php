<?php
namespace App\Service;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Psr\Log\LoggerInterface;
use Twig\Environment;

class MailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer, LoggerInterface $logger, Environment $twig )
    {
        $this->mailer = $mailer;
        $this->logger = $logger;
        $this->twig = $twig;
    }

    public function sendEmail(User $user, string $subject, string $template, array $context): void
    {
        $this->logger->info('Sending email to ' . $user->getEmail() . ' with subject: ' . $subject);
        $htmlContent = $this->twig->render($template, $context);

        $message = (new Email())
            ->from('instantstudioesgi@gmail.com')
            ->to($user->getEmail())
            ->subject($subject)
            ->html($htmlContent);

        try {
            $this->mailer->send($message);
        } catch (\Throwable $e) {
            $this->logger->error('Error sending email: ' . $e->getMessage());
            throw $e;
        }
    }
}
?>