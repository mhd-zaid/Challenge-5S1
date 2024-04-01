<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UnavailabilityHourRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UnavailabilityHourRepository::class)]
#[ApiResource]
class UnavailabilityHour
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column]
    private ?int $calendarDay = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilityHours')]
    private ?User $employee = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilityHours')]
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
