<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use App\Repository\StudioOpeningTimeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StudioOpeningTimeRepository::class)]
#[ApiResource(

    operations: [
        new GetCollection(),
        new Patch(
            security: "is_granted('ROLE_PRESTA') and object.getStudio().getCompany().getOwner() == user",
        ),
    ],
    stateless: false,
    normalizationContext: ['groups' => ['studioOpeningTime:read']],
    denormalizationContext: ['groups' => ['studioOpeningTime:write']],
)]
#[ApiFilter(
    SearchFilter::class,
    properties: ['studio' => 'exact']
)]
class StudioOpeningTime
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Assert\Type("\DateTime", message: "Le champ 'startTime' doit être une date valide.")]
    #[Groups(['studioOpeningTime:read','studioOpeningTime:write', 'company:read:presta', 'studio:read'])]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    #[Assert\Type("\DateTime", message: "Le champ 'endTime' doit être une date valide.")]
    #[Assert\GreaterThan(propertyPath: "startTime", message: "Le champ 'endTime' doit être postérieur à 'startTime'.")]
    #[Groups(['studioOpeningTime:read', 'studioOpeningTime:write', 'company:read:presta', 'studio:read'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Groups(['studioOpeningTime:read', 'company:read:presta', 'studio:read'])]
    #[Assert\Choice(choices: [1, 2, 3, 4, 5, 6, 0])]
    private ?int $day = null;

    #[ORM\ManyToOne(inversedBy: 'studioOpeningTimes')]
    #[Assert\NotBlank]
    #[Groups(['studioOpeningTime:read'])]
    private ?Studio $studio = null;

    public function __construct()
    {
    }

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

    public function getDay(): ?int
    {
        return $this->day;
    }

    public function setDay(int $day): static
    {
        $this->day = $day;

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
