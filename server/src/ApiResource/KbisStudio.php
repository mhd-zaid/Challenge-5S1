<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\KbisStateProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/info/studio/{siret}',
            requirements: ['siret' => '\d+'],
            openapiContext: [
                'description' => 'Get studio information by SIRET',
                'summary' => 'Get studio information by SIRET',
            ],
            normalizationContext: ['groups' => ['kbis:read']],
            provider: KbisStateProvider::class,
        )
    ],
    normalizationContext: ['groups' => ['kbis:read']],
)]
class KbisStudio
{
    #[Groups(['kbis:read'])]
    private ?string $siren = null;

    #[Groups(['kbis:read'])]
    private ?string $siret = null;

    #[Groups(['kbis:read'])]
    private ?string $denominationUniteLegale = null;

    #[Groups(['kbis:read'])]
    private ?string $dateCreationEtablissement = null;

    #[Groups(['kbis:read'])]
    private ?string $numeroVoieEtablissement = null;

    #[Groups(['kbis:read'])]
    private ?string $typeVoieEtablissement = null;

    #[Groups(['kbis:read'])]
    private ?string $libelleVoieEtablissement = null;

    #[Groups(['kbis:read'])]
    private ?string $codePostalEtablissement = null;

    #[Groups(['kbis:read'])]
    private ?string $libelleCommuneEtablissement = null;

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(?string $siren): void
    {
        $this->siren = $siren;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): void
    {
        $this->siret = $siret;
    }

    public function getDenominationUniteLegale(): ?string
    {
        return $this->denominationUniteLegale;
    }

    public function setDenominationUniteLegale(?string $denominationUniteLegale): void
    {
        $this->denominationUniteLegale = $denominationUniteLegale;
    }

    public function getDateCreationEtablissement(): ?string
    {
        return $this->dateCreationEtablissement;
    }

    public function setDateCreationEtablissement(?string $dateCreationEtablissement): void
    {
        $this->dateCreationEtablissement = $dateCreationEtablissement;
    }

    public function getNumeroVoieEtablissement(): ?string
    {
        return $this->numeroVoieEtablissement;
    }

    public function setNumeroVoieEtablissement(?string $numeroVoieEtablissement): void
    {
        $this->numeroVoieEtablissement = $numeroVoieEtablissement;
    }

    public function getTypeVoieEtablissement(): ?string
    {
        return $this->typeVoieEtablissement;
    }

    public function setTypeVoieEtablissement(?string $typeVoieEtablissement): void
    {
        $this->typeVoieEtablissement = $typeVoieEtablissement;
    }

    public function getLibelleVoieEtablissement(): ?string
    {
        return $this->libelleVoieEtablissement;
    }

    public function setLibelleVoieEtablissement(?string $libelleVoieEtablissement): void
    {
        $this->libelleVoieEtablissement = $libelleVoieEtablissement;
    }

    public function getCodePostalEtablissement(): ?string
    {
        return $this->codePostalEtablissement;
    }

    public function setCodePostalEtablissement(?string $codePostalEtablissement): void
    {
        $this->codePostalEtablissement = $codePostalEtablissement;
    }

    public function getLibelleCommuneEtablissement(): ?string
    {
        return $this->libelleCommuneEtablissement;
    }

    public function setLibelleCommuneEtablissement(?string $libelleCommuneEtablissement): void
    {
        $this->libelleCommuneEtablissement = $libelleCommuneEtablissement;
    }

}
