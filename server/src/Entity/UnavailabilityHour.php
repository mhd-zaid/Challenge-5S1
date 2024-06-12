<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UnavailabilityHourRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UnavailabilityHourRepository::class)]
#[ApiResource(
    operations: [
        new Get(securityPostDenormalize: "is_granted('AUTHORIZE', object)"),
        new Post(securityPostDenormalize: "is_granted('AUTHORIZE', object)"),
        new Patch(securityPostDenormalize: "is_granted('AUTHORIZE', object)"),
        new Delete(securityPostDenormalize: "is_granted('AUTHORIZE', object)"),
        // new GetCollection(securityPostDenormalize: "is_granted)
    ],
)]
class UnavailabilityHour
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull(message: "Le champ 'startTime' ne peut pas être nul.")]
    #[Assert\Type("\DateTimeInterface", message: "Le champ 'startTime' doit être une date valide.")]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull(message: "Le champ 'endTime' ne peut pas être nul.")]
    #[Assert\Type("\DateTimeInterface", message: "Le champ 'endTime' doit être une date valide.")]
    #[Assert\GreaterThan(propertyPath: "startTime", message: "Le champ 'endTime' doit être postérieur à 'startTime'.")]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilityHours')]
    #[Assert\NotNull(message: "Le champ 'employee' ne peut pas être nul.")]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?User $employee = null;

    #[ORM\Column]
    #[Assert\Choice(choices: ['Pending', 'Accepted', 'Rejected'], message: "Le champ 'status' doit être 'Pending', 'Accepted' ou 'Rejected'.")]
    #[Groups(['unavailabilityHour:admin:read'])]
    private string $status = 'Pending';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): static
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeInterface $endTime): static
    {
        $this->endTime = $endTime;

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

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
}
