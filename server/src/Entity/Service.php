<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\ServiceController;
use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['service:read']],
    operations: [
        new Post(),
        new GetCollection(),
        new Delete(),
    ]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: ['studio' => 'exact']
)]
class Service
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['service:read','studio:read'])]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read','studio:read'])]
    #[Assert\Length(min: 5, max: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['service:read'])]
    #[Assert\Length(min: 20, max: 255)]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['service:read','studio:read'])]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(0)]
    private ?int $cost = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['service:read','studio:read'])]
    #[Assert\NotNull]
    #[Assert\GreaterThan(0)]
    private ?\DateTimeInterface $duration = null;

    #[ORM\ManyToOne(inversedBy: 'services')]
    #[Groups(['service:read'])]
    #[Assert\NotNull]
    private ?Studio $studio = null;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: ServiceEmployee::class)]
    private Collection $serviceEmployees;

    public function __construct()
    {
        $this->serviceEmployees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCost(): ?int
    {
        return $this->cost;
    }

    public function setCost(int $cost): static
    {
        $this->cost = $cost;

        return $this;
    }

    public function getDuration(): ?\DateTimeInterface
    {
        return $this->duration;
    }

    public function setDuration(\DateTimeInterface $duration): static
    {
        $this->duration = $duration;

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

    /**
     * @return Collection<int, ServiceEmployee>
     */
    public function getServiceEmployees(): Collection
    {
        return $this->serviceEmployees;
    }

    public function addServiceEmployee(ServiceEmployee $serviceEmployee): static
    {
        if (!$this->serviceEmployees->contains($serviceEmployee)) {
            $this->serviceEmployees->add($serviceEmployee);
            $serviceEmployee->setService($this);
        }

        return $this;
    }

    public function removeServiceEmployee(ServiceEmployee $serviceEmployee): static
    {
        if ($this->serviceEmployees->removeElement($serviceEmployee)) {
            // set the owning side to null (unless already changed)
            if ($serviceEmployee->getService() === $this) {
                $serviceEmployee->setService(null);
            }
        }

        return $this;
    }
}
