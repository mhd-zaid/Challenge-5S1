<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Company;
use App\Entity\Studio;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class StudioFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $obj = (new Studio())
            ->setName('Studio 01')
            ->setDescription($faker->text)
            ->setPhone($faker->phoneNumber)
            ->setCountry($faker->country)
            ->setAddress($faker->address)
            ->setZipCode($faker->postcode)
            ->setCity($faker->city)
            ->setCompany($manager->getRepository(Company::class)->findAll()[0] ?? null)
            ->setUtilisateur($manager->getRepository(User::class)->findAll()[0] ?? null);
        $manager->persist($obj);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CompanyFixtures::class,
            UserFixtures::class
        ];
    }
}
