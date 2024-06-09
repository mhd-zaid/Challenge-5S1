<?php

namespace App\DataFixtures;

use App\Entity\Service;
use App\Entity\Studio;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class ServiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {

        $obj = new Service();
        $obj->setName('Service 1');
        $obj->setDescription('Description 1');
        $obj->setCost(1000);
        $obj->setDuration(new \DateTime('00:30:00'));
        $obj->setStudio($manager->getRepository(Studio::class)->findAll()[0] ?? null);
        $manager->persist($obj);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            StudioFixtures::class
        ];
    }
}
