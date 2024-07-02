<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Traits\TimestampableTrait;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Operation\SoftDelete;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'utilisateur')]
#[ApiResource(
    operations: [
        new Get(security:'is_granted("ROLE_ADMIN")'),
        new Post(securityPostDenormalize: "is_granted('CAN_CREATE', object)"),
        new Patch(securityPostDenormalize:"is_granted('CAN_EDIT', object)"),
        new SoftDelete(securityPostDenormalize:"is_granted('CAN_EDIT', object)"),
        new GetCollection(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_PRESTA')"),
        new Get(
            uriTemplate: '/me',
            name: 'me',
        ),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:input']],
)]

class User implements UserInterface, PasswordAuthenticatedUserInterface
{

    use Traits\BlameableTrait;
    use TimestampableTrait;
    use Traits\SoftDeleteableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2,minMessage:'Le nom doit comporter au moins 2 caractères')]
    #[Assert\Regex(
        pattern: '/^[a-zA-ZÀ-ÿ -]+$/u',
        message: 'La valeur doit être une chaîne de caractères valide pour un prénom ou un nom de famille'
    )]  
    #[Groups(['user:read', 'user:input', 'company:read:presta', 'planning:read', 'unavailabilityHour:read', 'reservation:read'])]
    private ?string $lastname = null;
    
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2,minMessage:'Le prénom doit comporter au moins 2 caractères')]
    #[Assert\Regex(
        pattern: '/^[a-zA-ZÀ-ÿ -]+$/u',
        message: 'La valeur doit être une chaîne de caractères valide pour un prénom ou un nom de famille'
    )]
    #[Groups(['user:read', 'user:input', 'company:read:presta', 'planning:read', 'unavailabilityHour:read', 'reservation:read'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:input'])]
    private ?string $email = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\Regex(pattern : '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/',
    message: '8 caractères requis avec au moins une majuscule, minuscule, un chiffre et un caractère spécial')]
    #[Groups(['user:input'])]
    private ?string $plainPassword = null;

    #[ORM\Column]
    private ?bool $isValidated = false;

    #[ORM\Column]
    #[Assert\Unique]
    #[Assert\Choice(choices: ['ROLE_CUSTOMER', 'ROLE_PRESTA', 'ROLE_ADMIN', 'ROLE_EMPLOYEE'] , multiple: true)]
    #[Groups(['user:read'])]
    private array $roles = ['ROLE_CUSTOMER'];

    #[ORM\Column (length: 25, nullable: true)]
    #[Assert\Regex('/^\+?[0-9]+$/')]
    #[Groups(['user:read', 'user:input'])]
    private ?string $phone = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['user:input:admin', 'user:read:company'])]
    private ?Company $company = null;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: WorkHour::class)]
    private Collection $workHours;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: UnavailabilityHour::class)]
    private Collection $unavailabilityHours;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $token = null;

    /**
     * @var Collection<int, Reservation>
     */
    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Reservation::class, orphanRemoval: true)]
    private Collection $reservations;

    public function __construct()
    {
        $this->workHours = new ArrayCollection();
        $this->unavailabilityHours = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->reservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        return array_unique($roles);
    }

    public function addRole(string $role): self
    {
        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }

        return $this;
    }
    
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): User
    {
        $this->plainPassword = $plainPassword;

        if (null !== $plainPassword) {
            $this->updatedAt = new \DateTime('now');
        }

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

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

    public function getIsValidated(): ?bool
    {
        return $this->isValidated;
    }

    public function setIsValidated(bool $isValidated): self
    {
        $this->isValidated = $isValidated;

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
            $workHour->setEmployee($this);
        }

        return $this;
    }

    public function removeWorkHour(WorkHour $workHour): static
    {
        if ($this->workHours->removeElement($workHour)) {
            // set the owning side to null (unless already changed)
            if ($workHour->getEmployee() === $this) {
                $workHour->setEmployee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UnavailabilityHour>
     */
    public function getUnavailabilityHours(): Collection
    {
        return $this->unavailabilityHours;
    }

    public function addUnavailabilityHour(UnavailabilityHour $unavailabilityHour): static
    {
        if (!$this->unavailabilityHours->contains($unavailabilityHour)) {
            $this->unavailabilityHours->add($unavailabilityHour);
            $unavailabilityHour->setEmployee($this);
        }

        return $this;
    }

    public function removeUnavailabilityHour(UnavailabilityHour $unavailabilityHour): static
    {
        if ($this->unavailabilityHours->removeElement($unavailabilityHour)) {
            // set the owning side to null (unless already changed)
            if ($unavailabilityHour->getEmployee() === $this) {
                $unavailabilityHour->setEmployee(null);
            }
        }

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): static
    {
        $this->token = $token;

        return $this;
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
            $reservation->setCustomer($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getCustomer() === $this) {
                $reservation->setCustomer(null);
            }
        }

        return $this;
    }
}