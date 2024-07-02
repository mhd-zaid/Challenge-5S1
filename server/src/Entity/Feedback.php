<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Get;
use App\Repository\FeedbackRepository;
use App\State\FeedbackStateProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Validator\CompletedReservation;

#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
#[ApiResource(
    operations: [
        new Patch(processor: FeedbackStateProcessor::class),
        new Get(),
    ],
    normalizationContext: ['groups' => ['feedback:read']],
    denormalizationContext: ['groups' => ['feedback:write']]
)]
#[CompletedReservation]
class Feedback
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['feedback:read'])]
    private ?Uuid $id = null;

    #[ORM\Column]
    #[Assert\Range(min: 1, max: 5)]
    #[Groups(['feedback:write', 'feedback:read'])]
    private ?int $note = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['feedback:write', 'feedback:read'])]
    #[Assert\Length(max: 255)]
    private ?string $message = null;

    #[ORM\OneToOne(inversedBy: 'feedback', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['feedback:read'])]
    private ?Reservation $reservation = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getNote(): ?int
    {
        return $this->note;
    }

    public function setNote(?int $note): static
    {
        $this->note = $note;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getReservation(): ?Reservation
    {
        return $this->reservation;
    }

    public function setReservation(Reservation $reservation): static
    {
        $this->reservation = $reservation;

        return $this;
    }
}
