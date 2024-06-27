<?php

namespace App\Tests;

use App\Entity\Stat;
use App\Entity\Studio;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StatUnitTest extends WebTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testStatCreation(): void
    {
        $studios = self::$entityManager->getRepository(Studio::class)->findAll();
        $stat = new Stat();
        $stat->setDate(new \DateTime());
        $stat->setIp('192.168.1.100');
        $stat->setStudio($studios[0]);

        self::$entityManager->persist($stat);
        self::$entityManager->flush();

        $this->assertNotNull($stat->getId());
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
