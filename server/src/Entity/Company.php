<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\CompanyController;
use App\Repository\CompanyRepository;
use App\State\CompanyPostStateProcessor;
use App\State\CompanyStateProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
USE Symfony\Component\HttpFoundation\File\File;

#[ORM\Entity(repositoryClass: CompanyRepository::class)]
#[Vich\Uploadable()]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(
            uriTemplate: '/companies',
            stateless: false,
            processor: CompanyPostStateProcessor::class,
//            controller: CompanyController::class,
//            openapiContext: [
//                'summary' => 'Create a company request',
//                'description' => 'Create a company request',
//            ],
            normalizationContext: ['groups' => ['company:read']],
            denormalizationContext: ['groups' => ['company:write']],
//            read: false,
//            deserialize: false,
        ),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['company:read']],
    denormalizationContext: ['groups' => ['company:write']],
//    provider: CompanyStateProvider::class,
//    processor: CompanyStateProcessor::class,
)]
class Company
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
//    #[ApiProperty(identifier: false)]
    #[Groups(['company:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 14)]
    #[Assert\Length(min: 14, max: 14)]
    #[Assert\Regex(pattern: '/^[0-9]{14}$/', message: 'Le SIRET doit contenir 14 chiffres')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $siret = null;

    #[ORM\Column(length: 255)]
    #[Assert\Email()]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'L\'email doit contenir entre 2 et 255 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 10)]
    #[Assert\Length(min: 10, max: 10, exactMessage: 'Le numéro de téléphone doit contenir 10 chiffres')]
    #[Assert\Regex(pattern: '/^[0-9]{10}$/', message: 'Le numéro de téléphone doit contenir 10 chiffres')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Country]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'Le pays doit contenir au moins 2 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $country = null;

    #[ORM\Column(length: 5)]
    #[Assert\Length(min: 5, max: 5)]
    #[Assert\Regex(pattern: '/^[0-9]{5}$/', message: 'Le code postal doit contenir 5 chiffres')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $zipCode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'La ville doit contenir au moins 2 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'L\'adresse doit contenir au moins 2 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $address = null;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: User::class)]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: Studio::class)]
    private Collection $studios;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups(['company:read', 'company:write'])]
    public ?MediaObject $kbis = null;

    #[ORM\Column(length: 255)]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'Le nom doit contenir entre 2 et 255 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['company:write'])]
    private ?bool $isVerified = false;

    #[ORM\Column]
    #[Groups(['company:write'])]
    private ?bool $isActive = false;

    private ?string $fullAddress = null;

    #[ORM\ManyToOne(inversedBy: 'companies')]
    #[Groups(['company:read', 'company:write'])]
    private ?User $owner = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['company:write'])]
    private ?string $description = null;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->studios = new ArrayCollection();
        $this->kbis = null;
        $this->setCreatedAt(new \DateTime("now"));
        $this->setUpdatedAt(new \DateTime("now"));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): static
    {
        $this->siret = $siret;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

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

    public function getKbis(): ?MediaObject
    {
        return $this->kbis;
    }

    public function setKbis(?MediaObject $kbis): void
    {
        $this->kbis = $kbis;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setCompany($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getCompany() === $this) {
                $user->setCompany(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Studio>
     */
    public function getStudios(): Collection
    {
        return $this->studios;
    }

    public function addStudio(Studio $studio): static
    {
        if (!$this->studios->contains($studio)) {
            $this->studios->add($studio);
            $studio->setCompany($this);
        }

        return $this;
    }

    public function removeStudio(Studio $studio): static
    {
        if ($this->studios->removeElement($studio)) {
            // set the owning side to null (unless already changed)
            if ($studio->getCompany() === $this) {
                $studio->setCompany(null);
            }
        }

        return $this;
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

    public function isVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

}
