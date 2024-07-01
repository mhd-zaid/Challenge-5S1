<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240630203629 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE company ADD status VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE company DROP is_verified');
        $this->addSql('ALTER TABLE company DROP is_rejected');
        $this->addSql('ALTER TABLE company DROP is_active');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE company ADD is_verified BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE company ADD is_rejected BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE company ADD is_active BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE company DROP status');
    }
}
