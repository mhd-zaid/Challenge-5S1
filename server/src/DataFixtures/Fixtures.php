<?php

namespace App\DataFixtures;


use App\Entity\Company;
use App\Entity\Service;
use App\Entity\Studio;
use App\Entity\StudioOpeningTime;
use App\Entity\UnavailabilityHour;
use App\Entity\User;
use App\Entity\WorkHour;
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
        $this->realUser($manager);
        $this->addUserToCompany($manager);
        $this->addCompanyAndUserToStudio($manager);
        $this->loadServiceFixture($manager);
        $this->loadStudioOpeningTimeFixture($manager);
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
            while ($userCount < 5 && $userIndex < $totalUsers) {
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
            $studio = $studios[$i];
            $studio->setName($company->getName() . " - Studio");
            $studio->setCompany($company);
            $users = $company->getUsers();
            $admin = false;
            foreach ($users as $user) {
                if (in_array('ROLE_ADMIN', $user->getRoles())) {
                    $admin = true;
                    $studio->setUtilisateur($user);
                    $manager->persist($studio);
                    break;
                }
            }
            if (!$admin) {
                $user = $users[0];
                $studio->setUtilisateur($user);
                $user->setRoles(['ROLE_ADMIN']);
                $manager->persist($user);
            }
            $manager->persist($studio);
            $manager->persist($company);
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
            'user{1..16}' => [
                'lastName'=> '<lastName()>',
                'firstName'=> '<firstName()>',
                'email'=> '<email()>',
                'password'=> 'Motdepasse123!',
                'isValidated'=> true,
                'roles'=> ['<randomElement(["ROLE_CUSTOMER"])>'],
                'phone'=> '<numerify("06########")>',
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
            'company{1..4}' => [
                'name'=> '<company()>',
                'phone'=> '<numerify("01########")>',
                'country'=> 'FRANCE',
                'address'=> '<address()>',
                'siret'=> '<randomElement(["12345678901234"])>',
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
            'studio{1..4}' => [
                'name'=> ' - Studio',
                'phone'=> '<numerify("09########")>',
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
            $object->setSiret($this->fetchSiret($object->getAddress()));
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
        $address = $this->fetchAddress(rand(1, 250));
        $object->setAddress($address['address']);
        $object->setZipCode($address['zipCode']);
        $object->setCity($address['city']);

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
            $service->addStudio($studio);
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

    /**
     * Permet de générer les fixtures pour les horaires de travail
     *
     * @param ObjectManager $manager
     * @return void
     */
    private function loadStudioOpeningTimeFixture(ObjectManager $manager): void
    {
        $studios = $manager->getRepository(Studio::class)->findAll();
        foreach ($studios as $studio) {
            $daysToOpen = rand(3, 6);
            $days = [1, 2, 3, 4, 5, 6, 0];
            $daysToOpenArray = array_rand($days, $daysToOpen);
            foreach ($daysToOpenArray as $day) {
                $studioOpeningTime = new StudioOpeningTime();
                $studioOpeningTime->setStudio($studio);
                $studioOpeningTime->setDay($day);
                $startTimes = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00'];
                $endTimes = ['17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];
                $startTime = new \DateTime($startTimes[array_rand($startTimes)]);
                $endTime = new \DateTime($endTimes[array_rand($endTimes)]);
                $openingTime = $endTime->diff($startTime);
                while ($openingTime->h < 12) {
                    $startTime = new \DateTime($startTimes[array_rand($startTimes)]);
                    $endTime = new \DateTime($endTimes[array_rand($endTimes)]);
                    $openingTime = $endTime->diff($startTime);
                }
                $studioOpeningTime->setStartTime($startTime);
                $studioOpeningTime->setEndTime($endTime);
                $manager->persist($studioOpeningTime);
            }
        }
        $manager->flush();
    }

    private function realUser(ObjectManager $manager): void
    {
        $realUsers = [
            [
                'lastName' => 'Mouhamad',
                'firstName' => 'Zaid',
                'email' => 'zaid@mail.fr',
                'password' => 'Motdepasse123!',
                'isValidated' => true,
                'roles' => ['ROLE_CUSTOMER'],
                'phone' => '0607080910',
                'createdAt' => new \DateTime(),
                'updatedAt' => new \DateTime()
            ],
            [
                'lastName' => 'Zeknine',
                'firstName' => 'Jugurtha',
                'email' => 'jug@mail.fr',
                'password' => 'Motdepasse123!',
                'isValidated' => true,
                'roles' => ['ROLE_CUSTOMER'],
                'phone' => '0605060708',
                'createdAt' => new \DateTime(),
                'updatedAt' => new \DateTime()
            ],
            [
                'lastName' => 'Kamissoko',
                'firstName' => 'Makan',
                'email' => 'mak@mail.fr',
                'password' => 'Motdepasse123!',
                'isValidated' => true,
                'roles' => ['ROLE_CUSTOMER'],
                'phone' => '0601020304',
                'createdAt' => new \DateTime(),
                'updatedAt' => new \DateTime()
            ],
            [
                'lastName' => 'Manea',
                'firstName' => 'Daniel',
                'email' => 'dan@mail.fr',
                'password' => 'Motdepasse123!',
                'isValidated' => true,
                'roles' => ['ROLE_CUSTOMER'],
                'phone' => '0608000100',
                'createdAt' => new \DateTime(),
                'updatedAt' => new \DateTime()
            ],
        ];

        foreach ($realUsers as $realUser) {
            $user = new User();
            $user->setLastName($realUser['lastName']);
            $user->setFirstName($realUser['firstName']);
            $user->setEmail($realUser['email']);
            $user->setPassword(password_hash($realUser['password'], PASSWORD_BCRYPT));
            $user->setIsValidated($realUser['isValidated']);
            $user->setRoles($realUser['roles']);
            $user->setPhone($realUser['phone']);
            $user->setCreatedAt($realUser['createdAt']);
            $user->setUpdatedAt($realUser['updatedAt']);
            $manager->persist($user);
        }
        $manager->flush();
    }

    private function fetchAddress(int $number): array
    {
        $streetType = ['rue', 'avenue', 'boulevard', 'impasse', 'place', 'chemin', 'allée'];
        $query = "$number+" . $streetType[rand(0, 6)];
        $addresses = json_decode(file_get_contents("https://api-adresse.data.gouv.fr/search/?q=$query&limit=50"));
        $random = rand(0, 49);
        $address = $addresses->features[$random]->properties;

        return [
            'address' => $address->name,
            'city' => $address->city,
            'zipCode' => $address->postcode
        ];
    }

    private function fetchSiret(string $address): string
    {
        $address = urlencode($address);
        $coordinates = json_decode(file_get_contents("https://api-adresse.data.gouv.fr/search/?q=$address&limit=1"));
        $lat = $coordinates->features[0]->geometry->coordinates[1];
        $lon = $coordinates->features[0]->geometry->coordinates[0];

        $companies = json_decode(file_get_contents("https://recherche-entreprises.api.gouv.fr/near_point?lat=$lat&long=$lon&radius=20&limite_matching_etablissements=10&minimal=true&include=siege%2Ccomplements&page=1&per_page=20"));
        $random = rand(0,15);

        return $companies->results[$random]->siege->siret;
    }
}
