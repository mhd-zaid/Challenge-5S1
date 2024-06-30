<?php

namespace App\Tests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserUnitTest extends WebTestCase
{
    private static $entityManager;

    public static function setUpBeforeClass(): void
    {
        self::bootKernel();
        self::$entityManager = static::getContainer()->get('doctrine')->getManager();
    }

    public function testUserCreation(): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setFirstname('John');
        $user->setLastname('Doe');
        $user->setPlainPassword('Password123!');
        $user->setRoles(['ROLE_USER']);

        self::$entityManager->persist($user);
        self::$entityManager->flush();

        $this->assertNotNull($user->getId());
    }

    public function testUserUpdate(): void
    {
        $user = self::$entityManager->getRepository(User::class)->findOneByEmail('test@example.com');
        $this->assertNotNull($user);

        $user->setFirstname('Jane');
        self::$entityManager->flush();

        $updatedUser = self::$entityManager->getRepository(User::class)->findOneByEmail('test@example.com');
        $this->assertEquals('Jane', $updatedUser->getFirstname());
    }

    public function testGetUserById(): void
    {
        $user = self::$entityManager->getRepository(User::class)->findOneByEmail('test@example.com');
        $this->assertNotNull($user);

        $userId = $user->getId();
        $retrievedUser = self::$entityManager->getRepository(User::class)->find($userId);
        $this->assertEquals($user->getEmail(), $retrievedUser->getEmail());
    }

    public function testGetAllUsers(): void
    {
        $users = self::$entityManager->getRepository(User::class)->findAll();
        $this->assertIsArray($users);
        $this->assertGreaterThan(0, count($users));
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
