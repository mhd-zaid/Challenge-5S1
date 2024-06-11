<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ReservationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ApiResource]
class Reservation
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[Groups(['reservation:read'])]
    private ?User $utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[Groups(['reservation:read'])]
    private ?ServiceEmployee $serviceEmployee = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['reservation:read'])]
    private ?\DateTimeInterface $horaire = null;

    #[ORM\Column]
    #[Assert\Choice(choices: ['RESERVED', 'UPDATED', 'CANCELED', 'COMPLETED'])]
    #[Groups(['reservation:read'])]
    private $status;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUtilisateur(): ?User
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?User $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }

    public function getServiceEmployee(): ?ServiceEmployee
    {
        return $this->serviceEmployee;
    }

    public function setServiceEmployee(?ServiceEmployee $serviceEmployee): static
    {
        $this->serviceEmployee = $serviceEmployee;

        return $this;
    }

    public function getHoraire(): ?\DateTimeInterface
    {
        return $this->horaire;
    }

    public function setHoraire(\DateTimeInterface $horaire): static
    {
        $this->horaire = $horaire;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
}
