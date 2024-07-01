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
use ApiPlatform\Metadata\GetCollection;
use App\Operation\SoftDelete;
use App\Validator\StudioHasService;
use App\Validator\EmployeeBelongsToStudio;
use App\Validator\AvailableSlot;



#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['reservation:read']],
    denormalizationContext: ['groups' => ['reservation:create']],
    operations: [
        new GetCollection('is_granted("ROLE_CUSTOMER")'),
        new Post(
            security: "is_granted('ROLE_CUSTOMER')",
            securityPostDenormalize: "is_granted('AUTHORIZE', object)", 
            securityPostDenormalizeMessage: "Only the customer can create a reservation.",
        ),
        new Patch(
            security: "object.getStatus() === 'RESERVED'",
            securityPostDenormalize: "is_granted('EDIT', object)",
        ),
        new SoftDelete(security: "is_granted('EDIT', object)"),
    ]
    )]
    
#[AvailableSlot(groups: ['reservation:create'])]
#[StudioHasService]
#[EmployeeBelongsToStudio]
class Reservation
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;
    use Traits\SoftDeleteableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['reservation:read', 'reservation:create'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    #[Assert\Choice(choices: ['RESERVED', 'COMPLETED', 'CANCELED'])]

    #[Groups(['reservation:read', 'reservation:update'])]
    private $status = 'RESERVED';

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:read'])]
    private ?User $customer = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:read', 'reservation:create'])]
    private ?User $employee = null;

    #[ORM\OneToOne(mappedBy: 'reservation', cascade: ['persist', 'remove'])]
    private ?Feedback $feedback = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:read', 'reservation:create'])]
    private ?Service $service = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:read', 'reservation:create'])]
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

        return $this;
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
