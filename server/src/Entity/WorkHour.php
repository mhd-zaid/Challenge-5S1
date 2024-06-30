<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use App\Operation\SoftDelete;
use App\Repository\WorkHourRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use App\Validator\UniqueWorkHour;
use App\Validator\WorkHourInStudioOpeningHours;

#[ORM\Entity(repositoryClass: WorkHourRepository::class)]
#[ApiResource (
    security: "is_granted('ROLE_PRESTA') or is_granted('ROLE_ADMIN')",
    normalizationContext: ['groups' => ['workHour:read']],
    denormalizationContext: ['groups' => ['workHour:write']],
    operations: [
        new Post(
            denormalizationContext: ['groups' => ['workHour:write']],
            securityPostDenormalize: "is_granted('CREATE', object)"
        ),
        new Patch(
            denormalizationContext: ['groups' => ['workHour:write']],
            securityPostDenormalize: "is_granted('EDIT', object)",
        ),
        new SoftDelete(
            denormalizationContext: ['groups' => ['workHour:delete']],
            securityPostDenormalize: "is_granted('AUTHORIZE', object)",
        )
    ]
)]
#[WorkHourInStudioOpeningHours]
#[UniqueWorkHour]
class WorkHour
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;
    use Traits\SoftDeleteableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['workHour:write', 'workHour:delete'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?\DateTimeInterface $startTime = null;
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['workHour:read', 'workHour:write'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\ManyToOne(inversedBy: 'workHours')]
    #[Assert\NotNull]
    #[Groups(['workHour:read', 'workHour:write','user:read'])]
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
