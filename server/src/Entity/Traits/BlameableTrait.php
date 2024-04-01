<?php

namespace App\Entity\Traits;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

trait BlameableTrait {

    #[ORM\ManyToOne]
    #[Gedmo\Blameable(on: 'create')]
    private ?User $createdBy = null;

    #[ORM\ManyToOne]
    #[Gedmo\Blameable(on: 'update')]
    private ?User $updatedBy = null;

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getUpdatedBy(): ?User
    {
        return $this->UpdatedBy;
    }

    public function setUpdatedBy(?User $UpdatedBy): self
    {
        $this->UpdatedBy = $UpdatedBy;

        return $this;
    }
}