<?php
namespace App\Tests;

use App\Entity\Studio;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StudioUnitTest extends WebTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testStudioCreation(): void
    {
        $studio = new Studio();
        $studio->setName('Studio Paris');
        $studio->setDescription('A cozy studio located in the heart of Paris.');
        $studio->setPhone('0123456789');
        $studio->setCountry('France');
        $studio->setZipCode('75000');
        $studio->setCity('Paris');
        $studio->setAddress('123 Paris St.');

        self::$entityManager->persist($studio);
        self::$entityManager->flush();

        $this->assertNotNull($studio->getId());
    }

    public function testStudioUpdate(): void
    {
        $studio = self::$entityManager->getRepository(Studio::class)->findAll()[rand(0, 3)];
        $this->assertNotNull($studio);
        $updatedStudio = $studio->setName('Studio Lyon');
        self::$entityManager->flush();
        $this->assertEquals('Studio Lyon', $updatedStudio->getName());
    }

    public function testGetStudioById(): void
    {
        $studio = self::$entityManager->getRepository(Studio::class)->findAll()[rand(0, 3)];
        $this->assertNotNull($studio);
        $studioId = $studio->getId();
        $retrievedStudio = self::$entityManager->getRepository(Studio::class)->find($studioId);
        $this->assertEquals($studio->getName(), $retrievedStudio->getName());
    }

    public function testGetAllStudios(): void
    {
        $studios = self::$entityManager->getRepository(Studio::class)->findAll();
        $this->assertIsArray($studios);
        $this->assertGreaterThan(0, count($studios));
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        if (self::$entityManager != null) {
            self::$entityManager->close();
            self::$entityManager = null;
        }
    }
}