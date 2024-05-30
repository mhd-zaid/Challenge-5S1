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
class CompanyRequestController extends AbstractController
{
    private $em;
    private $requestValidator;

    public function __construct(EntityManagerInterface $em, RequestValidator $requestValidator)
    {
        $this->requestValidator = $requestValidator;
        $this->em = $em;
    }

    public function __invoke(Request $request): Response
    {
        $requestParameters = $request->request->all();

        $expectedParameters = ['siret', 'email', 'phone', 'zipCode', 'name', 'ownerName', 'ownerFirstname'];
        $validationError = $this->requestValidator->validate($requestParameters, $expectedParameters);
        if ($validationError['success'] === false) {
            return new Response($validationError['error'], Response::HTTP_BAD_REQUEST);
        }

        $file = $request->files->get('file');
        if($file === null) {
            return new Response('Missing file', Response::HTTP_BAD_REQUEST);
        }
        if($file->getMimeType() !== 'application/pdf') {
            return new Response('Invalid file type', Response::HTTP_BAD_REQUEST);
        }


        $company = new Company();
        $company->setSiret($requestParameters['siret']);
        $company->setEmail($requestParameters['email']);
        $company->setPhone($requestParameters['phone']);
        $company->setZipCode($requestParameters['zipCode']);
        $company->setName($requestParameters['name']);
        $company->setOwnerName($requestParameters['ownerName']);
        $company->setOwnerFirstname($requestParameters['ownerFirstname']);
        $company->setFile($file);
        $company->setCreatedAt(new \DateTime());
        $company->setUpdatedAt(new \DateTime());
        //TODO: set user
        $this->em->persist($company);
        $this->em->flush();

        return new Response('Request received', Response::HTTP_OK);
    }
}
