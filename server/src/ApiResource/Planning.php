<?php

namespace App\ApiResource;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Studio;
use App\State\PlanningProvider;
use DateTimeInterface;

#[ApiResource(
    operations: [
        new GetCollection(provider: PlanningProvider::class, uriTemplate: '/plannings', normalizationContext: ['groups' => ['planning:read']]),
    ],
)]
class Planning 
{
    private string $type;
    private DateTimeInterface $startTime;
    private DateTimeInterface $endTime;
    private Studio $studio;

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function getStartTime(): ?DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(DateTimeInterface $startTime): void
    {
        $this->startTime = $startTime;
    }

    public function getEndTime(): ?DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(DateTimeInterface $endTime): void
    {
        $this->endTime = $endTime;
    }

    public function getStudio(): ?Studio
    {
        return $this->studio;
    }

    public function setStudio(Studio $studio): void
    {
        $this->studio = $studio;
    }
}