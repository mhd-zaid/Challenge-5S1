<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\WorkHourRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\WorkHourProvider;

#[ORM\Entity(repositoryClass: WorkHourRepository::class)]
#[ApiResource (
    normalizationContext: ['groups' => ['workHour:read']],
    denormalizationContext: ['groups' => ['workHour:write']],
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['workHour:read']],
            provider: WorkHourProvider::class,
            uriTemplate: '/work_hours/{employee}'
        ),
        new Post(
            denormalizationContext: ['groups' => ['workHour:write']],
            security: "is_granted('CREATE', object)"
        ),
        new Put(
            denormalizationContext: ['groups' => ['workHour:write']],
            security: "is_granted('EDIT', object)"
        ),
    ]
)]
class WorkHour
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?\DateTimeInterface $startTime = null;
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [1, 2, 3, 4, 5, 6, 0])]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?int $calendarDay = null;

    #[ORM\ManyToOne(inversedBy: 'workHours')]
    #[Assert\NotNull]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?User $employee = null;

    #[ORM\ManyToOne(inversedBy: 'workHours')]
    #[Assert\NotNull]
    #[Groups(['workHour:read', 'workHour:write'])]
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
