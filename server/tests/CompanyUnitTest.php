<?php

namespace App\Tests;

use App\Entity\Company;
use App\Entity\User;
use App\EventSubscriber\CompanyCreationSubscriber;
use Doctrine\Common\EventSubscriber;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class CompanyUnitTest extends KernelTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testCreateCompany(): void
    {
        $this->createMock(CompanyCreationSubscriber::class);
        $company = new Company();
        $company->setName('Test Company');
        $company->setEmail('test@example.com');
        $company->setPhone('1234567890');
        $company->setZipCode('12345');
        $company->setCity('Test City');
        $company->setOwner(self::$entityManager->getRepository(User::class)->find(rand(1,20)));

        self::$entityManager->persist($company);
        self::$entityManager->flush();

        $companyId = $company->getId();

        $this->assertNotNull($companyId);

        $savedCompany = self::$entityManager->getRepository(Company::class)->find($companyId);
        $this->assertEquals('Test Company', $savedCompany->getName());
        $this->assertEquals('test@example.com', $savedCompany->getEmail());
        $this->assertEquals('1234567890', $savedCompany->getPhone());
        $this->assertEquals('12345', $savedCompany->getZipCode());
        $this->assertEquals('Test City', $savedCompany->getCity());
    }

    public function testUpdateCompany(): void
    {
        $company = self::$entityManager->getRepository(Company::class)->findOneByEmail('test@example.com');

        $companyId = $company->getId();

        $company->setName('Updated Company');
        $company->setEmail('updated@example.com');

        self::$entityManager->flush();

        $updatedCompany = self::$entityManager->getRepository(Company::class)->find($companyId);

        $this->assertEquals('Updated Company', $updatedCompany->getName());
        $this->assertEquals('updated@example.com', $updatedCompany->getEmail());
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
