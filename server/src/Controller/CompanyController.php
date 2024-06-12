<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\User;
use App\EventSubscriber\UserCreationSubscriber;
use App\Service\KbisService;
use App\Service\SecurityService;
use App\Validator\RequestValidator;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CompanyController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em
        , private readonly RequestValidator $requestValidator
        , private readonly KbisService      $kbisService
        , private readonly SecurityService  $security
        , private readonly UserCreationSubscriber $userCreationSubscriber
    )
    {}

    public function __invoke(Request $request): Response
    {
        // Vérifiez le type de contenu
        if ($request->getContentTypeFormat() === 'json') {
            $data = json_decode($request->getContent(), true);
        } else {
            $data = $request->request->all();
        }

        // Définissez les paramètres attendus
        $expectedParameters = [
            'name',
            'description',
            'zipCode',
            'city',
            'companyPhone',
            'companyEmail',
            'siret',
            'website',
            'socialMedia',
            'ownerName',
            'ownerFirstname',
            'ownerPhone',
            'ownerEmail',
            'password'
        ];

        // Validez les données de la requête
        $validationError = $this->requestValidator->validate($data, $expectedParameters);
        if ($validationError['success'] === false) {
            return $this->json([
                'error' => $validationError,
                'request' => $request
            ], Response::HTTP_BAD_REQUEST);
        }

        $file = $request->files->get('file');
        if ($file === null) {
            return $this->json(['error' => 'Missing file', 'data' => $data], Response::HTTP_BAD_REQUEST);
        }
        if ($file->getMimeType() !== 'application/pdf') {
            return $this->json(['error' => 'Invalid file', 'data' => $data], Response::HTTP_BAD_REQUEST);
        }

        // Créez et persistez l'utilisateur
        $user = new User();
        $user->setLastname($data['ownerName']);
        $user->setFirstname($data['ownerFirstname']);
        $user->setEmail($data['ownerEmail']);
        $user->setPhone($data['ownerPhone']);
        $user->setRoles(['ROLE_PRESTA']);
        $user->setPlainPassword($data['password']);
        $this->em->persist($user);

        // Créez et persistez l'entreprise
        $company = new Company();
        $company->setSiret($data['siret']);
        $company->setEmail($data['companyEmail']);
        $company->setPhone($data['companyPhone']);
        $company->setZipCode($data['zipCode']);
        $company->setCity($data['city']);
        $company->setName($data['name']);
        $company->setOwner($user);
        $company->setFile($file);
        $this->em->persist($company);

        // Associez l'utilisateur à l'entreprise et persistez à nouveau
        $user->setCompany($company);
        $this->em->persist($user);
        $this->em->flush();

        return $this->json([
            'success' => true,
        ], Response::HTTP_CREATED);
    }


    public function getKbis(Request $request): Response
    {

        $siret = $request->attributes->get('siret');
        dump($request);

        dump($request->attributes->get('siret'));

        dump($siret);

        if ($siret === null) {
            return $this->json(['error' => 'Information manquante : siret'], Response::HTTP_BAD_REQUEST);
        }

        $kbisInfo = $this->kbisService->getKbisInfo($siret);

        if ($kbisInfo['status'] === 'invalid') {
            return $this->json(['error' => 'Information non vérifiée'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($kbisInfo, Response::HTTP_OK);

    }
}
