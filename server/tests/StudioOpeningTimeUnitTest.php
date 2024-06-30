<?php
namespace App\Tests;

use App\Entity\Studio;
use App\Entity\StudioOpeningTime;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StudioOpeningTimeUnitTest extends WebTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testStudioOpeningTimeCreation(): void
    {
        $studio = self::$entityManager->getRepository(Studio::class)->findOneBy([], ['id' => 'DESC']);

        $openingTime = new StudioOpeningTime();
        $openingTime->setDay(1);
        $openingTime->setStartTime(new \DateTime('09:00:00'));
        $openingTime->setEndTime(new \DateTime('17:00:00'));
        $openingTime->setStudio($studio);

        self::$entityManager->persist($openingTime);
        self::$entityManager->flush();

        $this->assertNotNull($openingTime->getId());
    }

    public function testStudioOpeningTimeUpdate(): void
    {
        $openingTime = self::$entityManager->getRepository(StudioOpeningTime::class)->findOneBy([], ['id' => 'DESC']);
        $this->assertNotNull($openingTime);

        $openingTime->setStartTime(new \DateTime('10:00:00'));
        self::$entityManager->flush();

        $updatedOpeningTime = self::$entityManager->getRepository(StudioOpeningTime::class)->find($openingTime->getId());
        $this->assertEquals('10:00:00', $updatedOpeningTime->getStartTime()->format('H:i:s'));
    }

    public function testGetStudioOpeningTimeById(): void
    {
        $openingTime = self::$entityManager->getRepository(StudioOpeningTime::class)->findOneBy([], ['id' => 'DESC']);
        $this->assertNotNull($openingTime);

        $openingTimeId = $openingTime->getId();
        $retrievedOpeningTime = self::$entityManager->getRepository(StudioOpeningTime::class)->find($openingTimeId);

        $this->assertEquals($openingTime->getDay(), $retrievedOpeningTime->getDay());
    }

    public function testGetAllStudioOpeningTimes(): void
    {
        $openingTimes = self::$entityManager->getRepository(StudioOpeningTime::class)->findAll();
        $this->assertIsArray($openingTimes);
        $this->assertGreaterThan(0, count($openingTimes));
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