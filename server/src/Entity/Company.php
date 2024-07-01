<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Operation\SoftDelete;
use App\Repository\CompanyRepository;
use App\State\CompanyPostStateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity(repositoryClass: CompanyRepository::class)]
#[Vich\Uploadable()]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_ADMIN') or object.getOwner() === user or object.getUsers().contains(user)"),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(
            uriTemplate: '/companies',
            processor: CompanyPostStateProcessor::class,
        ),
        new Patch(
            security: "is_granted('ROLE_ADMIN') or object.getOwner() === user"
        ),
    ],
    denormalizationContext: ['groups' => ['company:write']],
    normalizationContext: ['groups' => ['company:read']],
)]
class Company
{
    use Traits\BlameableTrait;
    use Traits\TimestampableTrait;
    use Traits\SoftDeleteableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: true)]
    #[Groups(['company:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'Le nom doit contenir entre 2 et 255 caractères')]
    #[Groups(['company:read', 'company:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 9, nullable: true)]
    #[Assert\Length(min: 9, max: 9)]
    #[Assert\Regex(pattern: '/^[0-9]{9}$/', message: 'Le SIREN doit contenir 9 chiffres')]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $siren = null;

    #[ORM\Column(length: 255)]
    #[Assert\Email()]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'L\'email doit contenir entre 2 et 255 caractères')]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 10)]
    #[Assert\Length(min: 10, max: 10, exactMessage: 'Le numéro de téléphone doit contenir 10 chiffres')]
    #[Assert\Regex(pattern: '/^[0-9]{10}$/', message: 'Le numéro de téléphone doit contenir 10 chiffres')]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $phone = null;
    #[ORM\Column(length: 5)]
    #[Assert\Length(min: 5, max: 5)]
    #[Assert\Regex(pattern: '/^[0-9]{5}$/', message: 'Le code postal doit contenir 5 chiffres')]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $zipCode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(min: 2, max: 255, exactMessage: 'La ville doit contenir au moins 2 caractères')]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $city = null;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: User::class)]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'company', targetEntity: Studio::class)]
    private Collection $studios;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    public ?MediaObject $kbis = null;

    #[ORM\ManyToOne(inversedBy: 'company')]
    private ?User $owner = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $website = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['company:read:presta', 'company:read:admin', 'company:write'])]
    private ?string $socialMedia = null;

    #[ORM\Column(length: 255)]
    #[Groups(['company:read:admin', 'company:write:admin'])]

    #[Assert\Choice(choices: [
        'pending',
        'accepted',
        'refused',
        'deleted'
    ])]
    private ?string $status = 'pending';

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->studios = new ArrayCollection();
        $this->kbis = null;
        $this->setCreatedAt(new \DateTime());
        $this->setUpdatedAt(new \DateTime());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(?string $siren): static
    {
        $this->siren = $siren;

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

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getSocialMedia(): ?string
    {
        return $this->socialMedia;
    }

    public function setSocialMedia(?string $socialMedia): static
    {
        $this->socialMedia = $socialMedia;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

}
