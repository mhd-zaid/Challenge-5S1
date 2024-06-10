<?php

namespace App\DataFixtures;

use App\Entity\Company;
use App\Entity\Service;
use App\Entity\ServiceEmployee;
use App\Entity\Studio;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Nelmio\Alice\Loader\NativeLoader;
use Symfony\Component\HttpFoundation\File\File;

class Fixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $loader = new NativeLoader($faker);
        $objectSet = $loader->loadData([
            'App\Entity\User' => $this->UserFixture(),
            'App\Entity\Company' => $this->CompanyFixture(),
            'App\Entity\Studio' => $this->StudioFixture(),
        ]);

        foreach ($objectSet->getObjects() as $object) {
            $this->userHandler($object, $manager);
            $this->companyHandler($object, $manager);
            $this->studioHandler($object, $manager);
        }

        $manager->flush();
        $this->addUserToCompany($manager);
        $this->addCompanyAndUserToStudio($manager);
        $this->loadServiceFixture($manager);
        $this->loadServiceEmployeeFixture($manager);
    }

    /**
     * Permet d'ajouter des utilisateurs à des entreprises
     * 
     * @param ObjectManager $manager
     * @return void
     */
    private function addUserToCompany(ObjectManager $manager): void
    {
        $users = $manager->getRepository(User::class)->findAll();
        $companies = $manager->getRepository(Company::class)->findAll();
        $userIndex = 0;
        $totalUsers = count($users);

        foreach ($companies as $company) {
            $userCount = 0;
            while ($userCount < 10 && $userIndex < $totalUsers) {
                $user = $users[$userIndex];
                if (!$user->getCompany()) {
                    $company->addUser($user);
                    $manager->persist($company);
                    $userCount++;
                }
                $userIndex++;
            }
            if ($userIndex >= $totalUsers) {
                break;
            }
        }
        $manager->flush();
    }

    /**
     * Permet d'ajouter des studios à des studios
     * 
     * @param ObjectManager $manager
     * @return void
     */
    private function addCompanyAndUserToStudio(ObjectManager $manager): void
    {
        $companies = $manager->getRepository(Company::class)->findAll();
        $studios = $manager->getRepository(Studio::class)->findAll();
        $i = 0;
        foreach ($companies as $company) {
            $users = $company->getUsers();
            $user = $users[array_rand($users->toArray())];
            $studio = $studios[$i];
            $studio->setName($company->getName() . " - Studio");
            $studio->setCompany($company);
            $studio->setUtilisateur($user);
            $user->setRoles(['ROLE_ADMIN']);
            $manager->persist($user);
            $manager->persist($studio);
            $i++;
        }
        $manager->flush();
    }

    /**
     * Permet de générer les fixtures pour les utilisateurs
     * 
     * @return array
     */
    private function userFixture() : array
    {
        return [
            'user{1..100}' => [
                'lastName'=> '<lastName()>',
                'firstName'=> '<firstName()>',
                'email'=> '<email()>',
                'password'=> 'Motdepasse123!',
                'isValidated'=> true,
                'roles'=> ['<randomElement(["ROLE_ADMIN", "ROLE_PRESTA", "ROLE_CUSTOMER"])>'],
                'phone'=> '0102030405',
                'createdAt'=> '<dateTimeBetween("-1 year", "now")>',
                'updatedAt'=> '<dateTimeBetween("now", "now")>'
            ]
        ];
    }

    /**
     * Permet de générer les fixtures pour les entreprises
     * 
     * @return array
     */
    private function companyFixture() : array
    {
        return [
            'company{1..10}' => [
                'name'=> '<company()>',
                'phone'=> '0102030405',
                'country'=> 'FRANCE',
                'address'=> '<address()>',
                'siret'=> '12345678901234',
                'createdAt'=> '<dateTimeBetween("-1 year", "now")>',
                'updatedAt'=> '<dateTimeBetween("now", "now")>',
            ],
        ];
    }

    /**
     * Permet de générer les fixtures pour les studios
     * 
     * @return array
     */
    private function studioFixture() : array
    {
        return [
            'studio{1..10}' => [
                'name'=> ' - Studio',
                'phone'=> '0102030405',
                'country'=> 'FRANCE',
                'address'=> '<address()>',
                'createdAt'=> '<dateTimeBetween("-1 year", "now")>',
                'updatedAt'=> '<dateTimeBetween("now", "now")>'
            ],
        ];
    }
    
    /**
     * Permet de gérer l'utilisateur
     * 
     * @param object $object
     * @param ObjectManager $manager
     * @return void
     */
    private function userHandler(object $object, ObjectManager $manager): void
    {
        if($object instanceof User) {
            $object->setPassword(password_hash($object->getPassword(), PASSWORD_BCRYPT));
//            $object = $this->addressHandler($object);
        }

        $manager->persist($object);
    }

    /**
     * Permet de gérer l'entreprise
     * 
     * @param object $object
     * @param ObjectManager $manager
     * @return void
     */
    private function companyHandler(object $object, ObjectManager $manager): void
    {
        if($object instanceof Company) {
            $email = 'administration@' . str_replace([" ","."],"",strtolower($object->getName())) . '.com';
            $object->setEmail($email);
            //$object->setFile(new File('srv/app/files/kbis/juin.pdf'));
            $object = $this->addressHandler($object);
        }

        $manager->persist($object);
    }

    private function studioHandler(object $object, ObjectManager $manager): void
    {
        if($object instanceof Studio) {
            $object = $this->addressHandler($object);
        }

        $manager->persist($object);
    }

    /**
     * Permet de gérer l'adresse
     * 
     * @param object $object
     * @return object
     */
    private function addressHandler($object): object
    {
        list($address, $cityZipCode) = explode("\n", $object->getAddress());
        preg_match('/(\d+)\s+(.+)/', $cityZipCode, $matches);
        $object->setAddress($address);
        $object->setZipCode($matches[1]);
        $object->setCity($matches[2]);

        return $object;
    }

    /**
     * Permet de générer les fixtures pour les services
     * 
     * @param ObjectManager $manager
     * @return void
     */
    private function loadServiceFixture(ObjectManager $manager): void
    {
        $studios = $manager->getRepository(Studio::class)->findAll();
        $serviceFixtures = [
            0 => [
                'name' => 'Service Mariage',
                'description' => 'Description du service 1',
                'cost' => 500,
                'duration' => new \DateTime('8:00:00')
            ],
            1 => [
                'name' => 'Service Mode',
                'description' => 'Description du service 2',
                'cost' => 300,
                'duration' => new \DateTime('2:00:00')
            ],
            2 => [
                'name' => 'Service Portrait',
                'description' => 'Description du service 3',
                'cost' => 200,
                'duration' => new \DateTime('1:00:00')
            ],
            3 => [
                'name' => 'Service Événementiel',
                'description' => 'Description du service 4',
                'cost' => 400,
                'duration' => new \DateTime('4:00:00')
            ],
            4 => [
                'name' => 'Service Culinaire',
                'description' => 'Description du service 5',
                'cost' => 150,
                'duration' => new \DateTime('0:30:00')
            ],
            5 => [
                'name' => 'Service Naissance',
                'description' => 'Description du service 6',
                'cost' => 100,
                'duration' => new \DateTime('0:30:00')
            ],
        ];
        foreach ($studios as $studio) {
            $service = new Service();
            $rand = rand(0, count($serviceFixtures) - 1);
            $service->setName($serviceFixtures[$rand]['name']);
            $service->setDescription($serviceFixtures[$rand]['description']);
            $service->setCost($serviceFixtures[$rand]['cost']);
            $service->setDuration($serviceFixtures[$rand]['duration']);
            $service->setStudio($studio);
            $service->setCreatedAt(new \DateTime());
            $service->setUpdatedAt(new \DateTime());
            $manager->persist($service);
        }
        $manager->flush();
    }

    /**
     * Permet de générer les fixtures pour les employés services
     * 
     * @param ObjectManager $manager
     * @return void
     */
    private function loadServiceEmployeeFixture(ObjectManager $manager): void
    {
        $services = $manager->getRepository(Service::class)->findAll();
        foreach ($services as $service) {
            $serviceEmployee = new ServiceEmployee();
            $serviceEmployee->setService($service);
            $rand = rand(1,4);
            $users = array_filter($service->getStudio()->getCompany()->getUsers()->toArray(), function($user) {
                return !in_array('ROLE_ADMIN', $user->getRoles());
            });
            for ($i = 0; $i < $rand; $i++) {
                $user = $users[array_rand($users)];
                $serviceEmployee->setEmployee($user);
                $user->setRoles(['ROLE_PRESTA']);
                $manager->persist($user);
                $manager->persist($serviceEmployee);
            }
        }
        $manager->flush();
    }
}
