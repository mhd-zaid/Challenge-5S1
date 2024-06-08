<?php

namespace App\DataFixtures;

use App\Entity\Service;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class ServiceEmployeeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ServiceFixtures::class,
            UserFixtures::class
        ];
    }
}
