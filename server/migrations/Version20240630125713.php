<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240630125713 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE service_studio DROP CONSTRAINT fk_74ec0280ed5ca9e6');
        $this->addSql('ALTER TABLE service_studio DROP CONSTRAINT fk_74ec0280446f285f');
        $this->addSql('DROP TABLE service_studio');
        $this->addSql('ALTER TABLE service ADD studio_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD2446F285F FOREIGN KEY (studio_id) REFERENCES studio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_E19D9AD2446F285F ON service (studio_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE service_studio (service_id INT NOT NULL, studio_id INT NOT NULL, PRIMARY KEY(service_id, studio_id))');
        $this->addSql('CREATE INDEX idx_74ec0280446f285f ON service_studio (studio_id)');
        $this->addSql('CREATE INDEX idx_74ec0280ed5ca9e6 ON service_studio (service_id)');
        $this->addSql('ALTER TABLE service_studio ADD CONSTRAINT fk_74ec0280ed5ca9e6 FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service_studio ADD CONSTRAINT fk_74ec0280446f285f FOREIGN KEY (studio_id) REFERENCES studio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service DROP CONSTRAINT FK_E19D9AD2446F285F');
        $this->addSql('DROP INDEX IDX_E19D9AD2446F285F');
        $this->addSql('ALTER TABLE service DROP studio_id');
    }
}
