<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait SoftDeleteableTrait {

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $deletedAt = null;

    public function getDeletedAt(): ?\DateTime
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTime $deletedAt): self
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }
}