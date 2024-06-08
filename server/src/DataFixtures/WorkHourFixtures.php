<?php

namespace App\DataFixtures;

use App\Entity\Studio;
use App\Entity\User;
use App\Entity\WorkHour;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class WorkHourFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            StudioFixtures::class,
            UserFixtures::class
        ];
    }
}
