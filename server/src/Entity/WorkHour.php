<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\WorkHourRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WorkHourRepository::class)]
#[ApiResource]
class WorkHour
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read'])]
    private ?\DateTimeInterface $startTime = null;
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [1, 2, 3, 4, 5, 6, 0])]
    #[Groups(['workHour:read'])]
    private ?int $calendarDay = null;

    #[ORM\ManyToOne(inversedBy: 'workHours')]
    #[Assert\NotNull]
    #[Groups(['workHour:read'])]
    private ?User $employee = null;

    #[ORM\ManyToOne(inversedBy: 'workHours')]
    #[Assert\NotNull]
    #[Groups(['workHour:read'])]
    private ?Studio $studio = null;

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
