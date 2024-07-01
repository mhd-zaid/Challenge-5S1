<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\StatRepository;
use App\State\StatProvider;
use App\State\StatReservationProvider;
use App\State\StatVisiteProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: StatRepository::class)]
#[ApiResource(
    operations:[
        new Get(
            security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_PRESTA')",
            provider: StatVisiteProvider::class,      
            uriTemplate: '/stats/studio/{id}',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_EMPLOYEE')",
            provider: StatReservationProvider::class,
            uriTemplate: '/stats/reservation',
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN')",
            provider: StatProvider::class,
            uriTemplate: '/stats',
        ),
        new Post()
    ],
    normalizationContext: ['groups' => ['stat:read']],
    denormalizationContext: ['groups' => ['stat:write']]
)]
class Stat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['stat:read', 'stat:write'])]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: "/^([0-9]{1,3}\.){3}[0-9]{1,3}$/")]
    private ?string $ip = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['stat:read', 'stat:write'])]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(inversedBy: 'stats')]
    #[Groups(['stat:read','stat:write'])]
    #[Assert\NotBlank]
    private ?Studio $studio = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function setIp(string $ip): static
    {
        $this->ip = $ip;

        return $this;
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
