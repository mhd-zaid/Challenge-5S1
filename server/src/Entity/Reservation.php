<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ReservationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use App\Validator\StudioHasService;
use App\Validator\EmployeeBelongsToStudio;
use App\Validator\AvailableSlot;
use App\State\ReservationStateProvider;

#[AvailableSlot]


#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['reservation:read']],
    operations: [
        new Post(
        securityPostDenormalize: "is_granted('AUTHORIZE', object)", 
        securityPostDenormalizeMessage: "Only the customer can create a reservation.",
        denormalizationContext: ['reservation:create']
        ),
        new Patch(securityPostDenormalize: "is_granted('EDIT', object)",
        denormalizationContext: ['groups' => ['reservation:update']],    
        ),
        new Delete(security: "is_granted('EDIT', object)"),
        new GetCollection(provider: ReservationStateProvider::class, normalizationContext: ['groups' => ['reservation:read']]),
    ]
)]

#[StudioHasService]
#[EmployeeBelongsToStudio]
class Reservation
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['reservation:create', 'reservation:update', 'reservation:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    #[Assert\Choice(choices: ['RESERVED', 'COMPLETED'])]
    #[Groups(['reservation:read'])]
    private $status = 'RESERVED';

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:create'])]
    private ?User $customer = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:create', 'reservation:read'])]
    private ?User $employee = null;

    #[ORM\OneToOne(mappedBy: 'reservation', cascade: ['persist', 'remove'])]
    private ?Feedback $feedback = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:create', 'reservation:read'])]
    private ?Service $service = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:create', 'reservation:read'])]
    private ?Studio $studio = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

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

    public function getCustomer(): ?User
    {
        return $this->customer;
    }

    public function setCustomer(?User $customer): static
    {
        $this->customer = $customer;

        return $this;
    }

    public function getEmployee(): ?User
    {
        return $this->employee;
    }

    public function setEmployee(?User $employee): static
    {
        $this->employee = $employee;

        return $this;
    }

    public function getFeedback(): ?Feedback
    {
        return $this->feedback;
    }

    public function setFeedback(Feedback $feedback): static
    {
        // set the owning side of the relation if necessary
        if ($feedback->getReservation() !== $this) {
            $feedback->setReservation($this);
        }

        $this->feedback = $feedback;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getStudio(): ?Studio
    {
        return $this->studio;
    }

    public function setStudio(?Studio $studio): static
    {
        $this->studio = $studio;
        return $this;
    }
}
