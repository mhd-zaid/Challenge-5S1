<?php

namespace App\DataFixtures;

use App\Entity\Company;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CompanyFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $obj = (new Company())
            ->setName('Presta')
            ->setKbis('89432980912')
            ->setEmail($faker->email)
            ->setPhone($faker->phoneNumber)
            ->setCountry('France')
            ->setZipCode('75000')
            ->setCity('Paris')
            ->setAddress($faker->address);
        $manager->persist($obj);

        $manager->flush();
    }
}
