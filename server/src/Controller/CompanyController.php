<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\User;
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
    )
    {}

    public function create(Request $request): Response
    {
        $user = $this->security->securityToken();

        if ($request->getContentTypeFormat() === 'json') {
            $data = json_decode($request->getContent(), true);
        } else {
            $data = $request->request->all();
        }

        $expectedParameters = ['siret', 'email', 'phone', 'zipCode', 'name', 'ownerName', 'ownerFirstname'];
        $validationError = $this->requestValidator->validate($data, $expectedParameters);
        if ($validationError['success'] === false) {
            return $this->json([
                'error' => $validationError
                , 'request' => $request
            ], Response::HTTP_BAD_REQUEST);
        }

        $file = $request->files->get('kbis');
        if($file === null) {
            return $this->json(['error' => 'Missing file', 'data' => $data], Response::HTTP_BAD_REQUEST);
        }
        if($file->getMimeType() !== 'application/pdf') {
            return $this->json(['error' => 'Invalid file', 'data' => $data], Response::HTTP_BAD_REQUEST);
        }

        $company = new Company();
        $company->setSiret($data['siret']);
        $company->setEmail($data['email']);
        $company->setPhone($data['phone']);
        $company->setZipCode($data['zipCode']);
        $company->setName($data['name']);
        $company->setOwnerName($data['ownerName']);
        $company->setOwnerFirstname($data['ownerFirstname']);
        $company->setFile($file);
        $company->setCreatedAt(new \DateTime());
        $company->setUpdatedAt(new \DateTime());
        $company->setCreatedBy($user->getId());
        $company->setUpdatedBy($user->getId());
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
