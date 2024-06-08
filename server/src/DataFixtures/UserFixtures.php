<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Company;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $pwd = 'test';

        $obj = (new User())
            ->setEmail('admin@mail.fr')
            ->setLastname($faker->lastName)
            ->setFirstname($faker->firstName)
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($pwd)
            ->setIsValidated(true);
        $manager->persist($obj);

        $obj = (new User())
            ->setEmail('presta@mail.fr')
            ->setLastname($faker->lastName)
            ->setFirstname($faker->firstName)
            ->setRoles(['ROLE_PRESTA'])
            ->setCompany($manager->getRepository(Company::class)->findAll()[0] ?? null)
            ->setPassword($pwd)
            ->setIsValidated(true);
        $manager->persist($obj);

        $obj = (new User())
            ->setEmail('customer@mail.fr')
            ->setLastname($faker->lastName)
            ->setFirstname($faker->firstName)
            ->setRoles(['ROLE_CUSTOMER'])
            ->setPassword($pwd)
            ->setIsValidated(true);
        $manager->persist($obj);



        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CompanyFixtures::class
        ];
    }
}
