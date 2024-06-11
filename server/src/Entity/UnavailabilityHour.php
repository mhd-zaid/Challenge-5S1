<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UnavailabilityHourRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UnavailabilityHourRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_EMPLOYEE') and object.getEmployee() == user"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Delete(security: "is_granted('ROLE_EMPLOYEE') and object.getEmployee() == user or is_granted('ROLE_ADMIN') or user.getCompany().getOwner() == user"),
        new GetCollection(security: "is_granted('ROLE_ADMIN')")
    ],
)]class UnavailabilityHour
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

    #[ORM\Column]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?int $calendarDay = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilityHours')]
    #[Assert\NotNull(message: "Le champ 'employee' ne peut pas être nul.")]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?User $employee = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilityHours')]
    #[Groups(['unavailabilityHour:admin:read'])]
    private ?StudioOpeningTime $studioOpeningTime = null;

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

    public function getCalendarDay(): ?int
    {
        return $this->calendarDay;
    }

    public function setCalendarDay(int $calendarDay): static
    {
        $this->calendarDay = $calendarDay;

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

    public function getStudioOpeningTime(): ?StudioOpeningTime
    {
        return $this->studioOpeningTime;
    }

    public function setStudioOpeningTime(?StudioOpeningTime $studioOpeningTime): static
    {
        $this->studioOpeningTime = $studioOpeningTime;

        return $this;
    }
}
