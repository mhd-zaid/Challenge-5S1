<?php

namespace App\DataFixtures;

use App\Entity\Studio;
use App\Entity\StudioOpeningTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;


class StudioOpeningTimeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            StudioFixtures::class
        ];
    }
}
