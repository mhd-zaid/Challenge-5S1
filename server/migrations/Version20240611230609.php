<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240611230609 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE company ADD kbis_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE company DROP file_path');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F25496F5C FOREIGN KEY (kbis_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_4FBF094F25496F5C ON company (kbis_id)');
        $this->addSql('ALTER TABLE media_object ADD created_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD updated_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE media_object ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_14D43132B03A8386 ON media_object (created_by_id)');
        $this->addSql('CREATE INDEX IDX_14D43132896DBBDE ON media_object (updated_by_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F25496F5C');
        $this->addSql('DROP INDEX IDX_4FBF094F25496F5C');
        $this->addSql('ALTER TABLE company ADD file_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE company DROP kbis_id');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132B03A8386');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132896DBBDE');
        $this->addSql('DROP INDEX IDX_14D43132B03A8386');
        $this->addSql('DROP INDEX IDX_14D43132896DBBDE');
        $this->addSql('ALTER TABLE media_object DROP created_by_id');
        $this->addSql('ALTER TABLE media_object DROP updated_by_id');
        $this->addSql('ALTER TABLE media_object DROP created_at');
        $this->addSql('ALTER TABLE media_object DROP updated_at');
    }
}
