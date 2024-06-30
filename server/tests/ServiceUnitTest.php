<?php

namespace App\Tests;

use App\Entity\Service;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ServiceUnitTest extends WebTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testServiceCreation(): void
    {
        $service = new Service();
        $service->setName('Service shooting foot');
        $service->setDescription('A relaxing Service shooting foot for all levels.');
        $service->setCost(100);
        $service->setDuration(new \DateTime('01:00:00'));

        self::$entityManager->persist($service);
        self::$entityManager->flush();

        $this->assertNotNull($service->getId());
    }

    public function testServiceUpdate(): void
    {
        $service = self::$entityManager->getRepository(Service::class)->findAll()[rand(0, 3)];
        $this->assertNotNull($service);

        $updatedService = $service->setName('Service foot');
        $this->assertEquals('Service foot', $updatedService->getName());
    }

    public function testGetServiceById(): void
    {
        $service = self::$entityManager->getRepository(Service::class)->findAll()[rand(0, 3)];
        $this->assertNotNull($service);

        $serviceId = $service->getId();
        $retrievedService = self::$entityManager->getRepository(Service::class)->find($serviceId);

        $this->assertEquals($service->getName(), $retrievedService->getName());
    }

    public function testGetAllServices(): void
    {
        $services = self::$entityManager->getRepository(Service::class)->findAll();
        $this->assertIsArray($services);
        $this->assertGreaterThan(0, count($services));
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