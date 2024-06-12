<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240611031150 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE company ADD description VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE company ADD street_number INT DEFAULT NULL');
        $this->addSql('ALTER TABLE company ADD street_type VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE company ADD street_name VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE company DROP description');
        $this->addSql('ALTER TABLE company DROP street_number');
        $this->addSql('ALTER TABLE company DROP street_type');
        $this->addSql('ALTER TABLE company DROP street_name');
    }
}
