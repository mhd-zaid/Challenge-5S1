<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Operation\SoftDelete;
use App\Repository\StudioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: StudioRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_PRESTA') or is_granted('ROLE_ADMIN')"),
        new Patch(security : "(is_granted('ROLE_PRESTA') and object.getCompany().getOwner() === user) or is_granted('ROLE_ADMIN')"),
        new SoftDelete(security : "(is_granted('ROLE_PRESTA') and object.getCompany().getOwner() === user) or is_granted('ROLE_ADMIN')")
    ],
    stateless: false,
    normalizationContext: ['groups' => ['studio:read']],
    denormalizationContext: ['groups' => ['studio:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'services.id' => 'exact',
    'city' => 'ipartial'
])]
class Studio
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;
    use Traits\SoftDeleteableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['studio:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'studio:write', 'company:read:presta', 'planning:read', 'studioOpeningTime:read', 'reservation:read', 'service:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5,max: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['studio:read', 'studio:write'])]
    #[Assert\Length(min:20,max: 255)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'studio:write', 'user:read:company'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:10,max: 10)]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'user:read:company'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:2,max: 10)]
    private ?string $country = 'France';

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'studio:write', 'user:read:company'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5,max: 5)]
    private ?string $zipCode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'studio:write', 'user:read:company'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:2,max: 255)]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:read', 'studio:write', 'user:read:company', 'planning:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5,max: 255)]
    private ?string $address = null;

    #[ORM\ManyToOne(inversedBy: 'studios')]
    #[Assert\NotNull]
    #[Groups(['studio:read', 'studio:write:admin'])]
    private ?Company $company = null;
    
    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: StudioOpeningTime::class)]
    #[Groups(['studio:read', 'company:read:presta'])]
    private Collection $studioOpeningTimes;

    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: WorkHour::class)]
    private Collection $workHours;

    #[Groups(['studio:read', 'planning:read'])]
    private ?string $fullAddress = null;

    /**
     * @var Collection<int, Reservation>
     */
    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: Reservation::class)]
    private Collection $reservations;

    /**
     * @var Collection<int, Stat>
     */
    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: Stat::class)]
    private Collection $stats;

    /**
     * @var Collection<int, Service>
     */
    #[ORM\OneToMany(mappedBy: 'studio', targetEntity: Service::class)]
    #[Groups(['studio:read'])]
    private Collection $services;

    public function __construct()
    {
        $this->studioOpeningTimes = new ArrayCollection();
        $this->workHours = new ArrayCollection();
        $this->reservations = new ArrayCollection();
        $this->stats = new ArrayCollection();
        $this->services = new ArrayCollection();
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

    /**
     * @return Collection<int, Reservation>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservation $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setStudio($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getStudio() === $this) {
                $reservation->setStudio(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Stat>
     */
    public function getStats(): Collection
    {
        return $this->stats;
    }

    public function addStat(Stat $stat): static
    {
        if (!$this->stats->contains($stat)) {
            $this->stats->add($stat);
            $stat->setStudio($this);
        }

        return $this;
    }

    public function removeStat(Stat $stat): static
    {
        if ($this->stats->removeElement($stat)) {
            // set the owning side to null (unless already changed)
            if ($stat->getStudio() === $this) {
                $stat->setStudio(null);
            }
        }

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

    #[Groups(['studio:read'])]
    public function getAverageNote(): float
    {
        $completedReservations = $this->reservations->filter(fn(Reservation $reservation) => $reservation->getStatus() === 'COMPLETED');
        $nbrFeedbacks = 0;
        $totalNote = 0;
        foreach ($completedReservations as $reservation) {
            if ($reservation->getFeedback() !== null) {
                $nbrFeedbacks++;
                $totalNote += $reservation->getFeedback()->getNote();
            }
        }

        return $nbrFeedbacks > 0 ? number_format($totalNote / $nbrFeedbacks, 1) : 0;
    }

    #[Groups(['studio:read'])]
    public function getNbrFeedbacks(): int
    {
        $nbrFeedbacks = 0;
        $completedReservations = $this->reservations->filter(fn(Reservation $reservation) => $reservation->getStatus() === 'COMPLETED');
        foreach ($completedReservations as $reservation) {
            if ($reservation->getFeedback() !== null && $reservation->getFeedback()?->getNote() !== null && $reservation->getFeedback()?->getMessage() !== null){
                $nbrFeedbacks++;
            }
        }

        return $nbrFeedbacks;
    }
}
