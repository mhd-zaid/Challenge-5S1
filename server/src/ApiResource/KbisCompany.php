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
            uriTemplate: '/info/company/{siren}',
            requirements: ['siren' => '\d+'],
            openapiContext: [
                'description' => 'Get company information by SIREN',
                'summary' => 'Get company information by SIREN',
            ],
            normalizationContext: ['groups' => ['kbis:read']],
            provider: KbisStateProvider::class,
        )
    ],
    normalizationContext: ['groups' => ['kbis:read']],
)]
class KbisCompany
{
    #[Groups(['kbis:read'])]
    private ?string $siren = null;

    #[Groups(['kbis:read'])]
    private ?string $denominationUniteLegale = null;

    #[Groups(['kbis:read'])]
    private ?string $dateCreationUniteLegale = null;

    #[Groups(['kbis:read'])]
    private ?string $sigleUniteLegale = null;

    public function getSigleUniteLegale(): ?string
    {
        return $this->sigleUniteLegale;
    }

    public function setSigleUniteLegale(?string $sigleUniteLegale): void
    {
        $this->sigleUniteLegale = $sigleUniteLegale;
    }

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

    public function getDateCreationUniteLegale(): ?string
    {
        return $this->dateCreationUniteLegale;
    }

    public function setDateCreationUniteLegale(?string $dateCreationUniteLegale): void
    {
        $this->dateCreationUniteLegale = $dateCreationUniteLegale;
    }


}
