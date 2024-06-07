<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\StudioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ORM\Entity(repositoryClass: StudioRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['studio:read']],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'services.id' => 'exact',
    'city' => 'partial'
])]
class Studio
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['studio:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $country = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $zipCode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read'])]
    private ?string $address = null;

    #[ORM\ManyToOne(inversedBy: 'studios')]
    private ?Company $company = null;

    #[ORM\ManyToOne(inversedBy: 'studios')]
    #[Groups(['studio:read'])]
    private ?User $utilisateur = null;

    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: Service::class)]
    #[Groups(['studio:read'])]
    private Collection $services;

    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: StudioOpeningTime::class)]
    private Collection $studioOpeningTimes;

    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: WorkHour::class)]
    private Collection $workHours;

    #[Groups(['studio:read'])]
    private ?string $fullAddress = null;

    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->studioOpeningTimes = new ArrayCollection();
        $this->workHours = new ArrayCollection();
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

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }

    public function setZipCode(string $zipCode): static
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(?Company $company): static
    {
        $this->company = $company;

        return $this;
    }

    public function getUtilisateur(): ?User
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?User $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }

    /**
     * @return Collection<int, Service>
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(Service $service): static
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
            $service->setStudio($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getStudio() === $this) {
                $service->setStudio(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, StudioOpeningTime>
     */
    public function getStudioOpeningTimes(): Collection
    {
        return $this->studioOpeningTimes;
    }

    public function addStudioOpeningTime(StudioOpeningTime $studioOpeningTime): static
    {
        if (!$this->studioOpeningTimes->contains($studioOpeningTime)) {
            $this->studioOpeningTimes->add($studioOpeningTime);
            $studioOpeningTime->setStudio($this);
        }

        return $this;
    }

    public function removeStudioOpeningTime(StudioOpeningTime $studioOpeningTime): static
    {
        if ($this->studioOpeningTimes->removeElement($studioOpeningTime)) {
            // set the owning side to null (unless already changed)
            if ($studioOpeningTime->getStudio() === $this) {
                $studioOpeningTime->setStudio(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, WorkHour>
     */
    public function getWorkHours(): Collection
    {
        return $this->workHours;
    }

    public function addWorkHour(WorkHour $workHour): static
    {
        if (!$this->workHours->contains($workHour)) {
            $this->workHours->add($workHour);
            $workHour->setStudio($this);
        }

        return $this;
    }

    public function removeWorkHour(WorkHour $workHour): static
    {
        if ($this->workHours->removeElement($workHour)) {
            // set the owning side to null (unless already changed)
            if ($workHour->getStudio() === $this) {
                $workHour->setStudio(null);
            }
        }

        return $this;
    }

    public function getFullAddress(): ?string
    {
        return $this->address . ', ' . $this->zipCode . ' ' . $this->city . ', ' . $this->country;
    }
}
