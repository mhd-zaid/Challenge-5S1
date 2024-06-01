<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\User;
use App\Service\KbisService;
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
    private $em;
    private $requestValidator;
    private $kbisService;

    public function __construct(EntityManagerInterface $em, RequestValidator $requestValidator, KbisService $kbisService)
    {
        $this->requestValidator = $requestValidator;
        $this->kbisService = $kbisService;
        $this->em = $em;
    }

    public function __invoke(Request $request): Response
    {

        $requestParameters = $request->request->all();

        return $this->json(['error' => $request], Response::HTTP_BAD_REQUEST);

        $expectedParameters = ['siret', 'email', 'phone', 'zipCode', 'name', 'ownerName', 'ownerFirstname'];
        $validationError = $this->requestValidator->validate($requestParameters, $expectedParameters);
        if ($validationError['success'] === false) {
            return $this->json(['error' => $validationError, 'request' => $request], Response::HTTP_BAD_REQUEST);
        }

//        $file = $request->files->get('file');
//        if($file === null) {
//            return $this->json(['error' => 'Missing file'], Response::HTTP_BAD_REQUEST);
//        }
//        if($file->getMimeType() !== 'application/pdf') {
//            return $this->json(['error' => 'Invalid file'], Response::HTTP_BAD_REQUEST);
//        }


        $company = new Company();
        $company->setSiret($requestParameters['siret']);
        $company->setEmail($requestParameters['email']);
        $company->setPhone($requestParameters['phone']);
        $company->setZipCode($requestParameters['zipCode']);
        $company->setName($requestParameters['name']);
        $company->setOwnerName($requestParameters['ownerName']);
        $company->setOwnerFirstname($requestParameters['ownerFirstname']);
//        $company->setFile($file);
        $company->setCreatedAt(new \DateTime());
        $company->setUpdatedAt(new \DateTime());
        //TODO: set user
        $this->em->persist($company);
        $this->em->flush();



        return $this->json(['success' => true], Response::HTTP_CREATED);
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
