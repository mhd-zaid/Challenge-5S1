<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240621215552 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE company_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE media_object_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE service_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE studio_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE studio_opening_time_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE unavailability_hour_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE work_hour_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE company (id INT NOT NULL, kbis_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, siren VARCHAR(9) DEFAULT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(10) NOT NULL, zip_code VARCHAR(5) NOT NULL, city VARCHAR(255) DEFAULT NULL, name VARCHAR(255) NOT NULL, is_verified BOOLEAN NOT NULL, is_active BOOLEAN NOT NULL, description VARCHAR(255) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, social_media VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4FBF094F25496F5C ON company (kbis_id)');
        $this->addSql('CREATE INDEX IDX_4FBF094F7E3C61F9 ON company (owner_id)');
        $this->addSql('CREATE INDEX IDX_4FBF094FB03A8386 ON company (created_by_id)');
        $this->addSql('CREATE INDEX IDX_4FBF094F896DBBDE ON company (updated_by_id)');
        $this->addSql('CREATE TABLE media_object (id INT NOT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_14D43132B03A8386 ON media_object (created_by_id)');
        $this->addSql('CREATE INDEX IDX_14D43132896DBBDE ON media_object (updated_by_id)');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, customer_id INT NOT NULL, employee_id INT NOT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_42C849559395C3F3 ON reservation (customer_id)');
        $this->addSql('CREATE INDEX IDX_42C849558C03F15C ON reservation (employee_id)');
        $this->addSql('CREATE INDEX IDX_42C84955B03A8386 ON reservation (created_by_id)');
        $this->addSql('CREATE INDEX IDX_42C84955896DBBDE ON reservation (updated_by_id)');
        $this->addSql('CREATE TABLE service (id INT NOT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, cost INT NOT NULL, duration TIME(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E19D9AD2B03A8386 ON service (created_by_id)');
        $this->addSql('CREATE INDEX IDX_E19D9AD2896DBBDE ON service (updated_by_id)');
        $this->addSql('CREATE TABLE service_studio (service_id INT NOT NULL, studio_id INT NOT NULL, PRIMARY KEY(service_id, studio_id))');
        $this->addSql('CREATE INDEX IDX_74EC0280ED5CA9E6 ON service_studio (service_id)');
        $this->addSql('CREATE INDEX IDX_74EC0280446F285F ON service_studio (studio_id)');
        $this->addSql('CREATE TABLE studio (id INT NOT NULL, company_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, phone VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, zip_code VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4A2B07B6979B1AD6 ON studio (company_id)');
        $this->addSql('CREATE INDEX IDX_4A2B07B6B03A8386 ON studio (created_by_id)');
        $this->addSql('CREATE INDEX IDX_4A2B07B6896DBBDE ON studio (updated_by_id)');
        $this->addSql('CREATE TABLE studio_opening_time (id INT NOT NULL, studio_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, start_time TIME(0) WITHOUT TIME ZONE NOT NULL, end_time TIME(0) WITHOUT TIME ZONE NOT NULL, day INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8C015D57446F285F ON studio_opening_time (studio_id)');
        $this->addSql('CREATE INDEX IDX_8C015D57B03A8386 ON studio_opening_time (created_by_id)');
        $this->addSql('CREATE INDEX IDX_8C015D57896DBBDE ON studio_opening_time (updated_by_id)');
        $this->addSql('CREATE TABLE unavailability_hour (id INT NOT NULL, employee_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, start_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6B4423308C03F15C ON unavailability_hour (employee_id)');
        $this->addSql('CREATE INDEX IDX_6B442330B03A8386 ON unavailability_hour (created_by_id)');
        $this->addSql('CREATE INDEX IDX_6B442330896DBBDE ON unavailability_hour (updated_by_id)');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, company_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, is_validated BOOLEAN NOT NULL, roles JSON NOT NULL, phone VARCHAR(25) DEFAULT NULL, token TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE INDEX IDX_8D93D649979B1AD6 ON "user" (company_id)');
        $this->addSql('CREATE INDEX IDX_8D93D649B03A8386 ON "user" (created_by_id)');
        $this->addSql('CREATE INDEX IDX_8D93D649896DBBDE ON "user" (updated_by_id)');
        $this->addSql('CREATE TABLE work_hour (id INT NOT NULL, employee_id INT DEFAULT NULL, studio_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, updated_by_id INT DEFAULT NULL, start_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_89DDA0768C03F15C ON work_hour (employee_id)');
        $this->addSql('CREATE INDEX IDX_89DDA076446F285F ON work_hour (studio_id)');
        $this->addSql('CREATE INDEX IDX_89DDA076B03A8386 ON work_hour (created_by_id)');
        $this->addSql('CREATE INDEX IDX_89DDA076896DBBDE ON work_hour (updated_by_id)');
        $this->addSql('CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at)');
        $this->addSql('COMMENT ON COLUMN messenger_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_messenger_messages() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'messenger_messages\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON messenger_messages;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON messenger_messages FOR EACH ROW EXECUTE PROCEDURE notify_messenger_messages();');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F25496F5C FOREIGN KEY (kbis_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094FB03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849559395C3F3 FOREIGN KEY (customer_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849558C03F15C FOREIGN KEY (employee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD2B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD2896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service_studio ADD CONSTRAINT FK_74EC0280ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service_studio ADD CONSTRAINT FK_74EC0280446F285F FOREIGN KEY (studio_id) REFERENCES studio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio ADD CONSTRAINT FK_4A2B07B6979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio ADD CONSTRAINT FK_4A2B07B6B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio ADD CONSTRAINT FK_4A2B07B6896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio_opening_time ADD CONSTRAINT FK_8C015D57446F285F FOREIGN KEY (studio_id) REFERENCES studio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio_opening_time ADD CONSTRAINT FK_8C015D57B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio_opening_time ADD CONSTRAINT FK_8C015D57896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE unavailability_hour ADD CONSTRAINT FK_6B4423308C03F15C FOREIGN KEY (employee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE unavailability_hour ADD CONSTRAINT FK_6B442330B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE unavailability_hour ADD CONSTRAINT FK_6B442330896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE work_hour ADD CONSTRAINT FK_89DDA0768C03F15C FOREIGN KEY (employee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE work_hour ADD CONSTRAINT FK_89DDA076446F285F FOREIGN KEY (studio_id) REFERENCES studio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE work_hour ADD CONSTRAINT FK_89DDA076B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE work_hour ADD CONSTRAINT FK_89DDA076896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE company_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE media_object_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE service_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE studio_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE studio_opening_time_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE unavailability_hour_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE work_hour_id_seq CASCADE');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F25496F5C');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F7E3C61F9');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094FB03A8386');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F896DBBDE');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132B03A8386');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132896DBBDE');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C849559395C3F3');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C849558C03F15C');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955B03A8386');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955896DBBDE');
        $this->addSql('ALTER TABLE service DROP CONSTRAINT FK_E19D9AD2B03A8386');
        $this->addSql('ALTER TABLE service DROP CONSTRAINT FK_E19D9AD2896DBBDE');
        $this->addSql('ALTER TABLE service_studio DROP CONSTRAINT FK_74EC0280ED5CA9E6');
        $this->addSql('ALTER TABLE service_studio DROP CONSTRAINT FK_74EC0280446F285F');
        $this->addSql('ALTER TABLE studio DROP CONSTRAINT FK_4A2B07B6979B1AD6');
        $this->addSql('ALTER TABLE studio DROP CONSTRAINT FK_4A2B07B6B03A8386');
        $this->addSql('ALTER TABLE studio DROP CONSTRAINT FK_4A2B07B6896DBBDE');
        $this->addSql('ALTER TABLE studio_opening_time DROP CONSTRAINT FK_8C015D57446F285F');
        $this->addSql('ALTER TABLE studio_opening_time DROP CONSTRAINT FK_8C015D57B03A8386');
        $this->addSql('ALTER TABLE studio_opening_time DROP CONSTRAINT FK_8C015D57896DBBDE');
        $this->addSql('ALTER TABLE unavailability_hour DROP CONSTRAINT FK_6B4423308C03F15C');
        $this->addSql('ALTER TABLE unavailability_hour DROP CONSTRAINT FK_6B442330B03A8386');
        $this->addSql('ALTER TABLE unavailability_hour DROP CONSTRAINT FK_6B442330896DBBDE');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649979B1AD6');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649B03A8386');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649896DBBDE');
        $this->addSql('ALTER TABLE work_hour DROP CONSTRAINT FK_89DDA0768C03F15C');
        $this->addSql('ALTER TABLE work_hour DROP CONSTRAINT FK_89DDA076446F285F');
        $this->addSql('ALTER TABLE work_hour DROP CONSTRAINT FK_89DDA076B03A8386');
        $this->addSql('ALTER TABLE work_hour DROP CONSTRAINT FK_89DDA076896DBBDE');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE service');
        $this->addSql('DROP TABLE service_studio');
        $this->addSql('DROP TABLE studio');
        $this->addSql('DROP TABLE studio_opening_time');
        $this->addSql('DROP TABLE unavailability_hour');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE work_hour');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
