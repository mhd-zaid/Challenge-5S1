<?php

namespace App\Entity;

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

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
#[ApiResource(
    operations: [
        new Post(),
        new GetCollection(),
        new GetCollection(
            uriTemplate: '/api/services/distinct/{column}',
            requirements: [
                'column' => '\w+',
            ],
            controller: ServiceController::class,
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'column',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'enum' => [
                                'id',
                                'name',
                                'description',
                                'cost',
                                'duration',
                                'studio'
                            ],
                            'description' => 'The column to distinct. Allowed values: id, name, description, cost, duration, studio',
                            'summary' => 'Retrieve distinct services by column'
                        ],
                    ],
                ],
            ],
            paginationEnabled: false,
            description: 'Get all services distinct by column',
            name: 'get_services_distinct_by_column',
        ),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['service:read']]
)
]
class Service
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['service:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read', 'service:read:list', 'service:read:detail','service:create', 'service:update'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['service:read', 'service:read:detail','service:create', 'service:update'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['service:read', 'service:read:detail','service:create', 'service:update'])]
    private ?int $cost = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['service:read', 'service:read:detail','service:create', 'service:update'])]
    private ?\DateTimeInterface $duration = null;

    #[ORM\ManyToOne(inversedBy: 'services')]
    #[Groups(['service:read', 'service:read:detail', 'service:create'])]
    private ?Studio $studio = null;

    #[ORM\OneToMany(mappedBy: 'service', targetEntity: ServiceEmployee::class)]
    #[Groups(['service:read:detail', 'service:create', 'service:update'])]
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
