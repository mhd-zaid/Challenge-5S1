<?php

namespace App\Controller;

use App\Service\KbisService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class KbisController extends AbstractController
{
    private $kbisService;

    public function __construct(KbisService $kbisService)
    {
        $this->kbisService = $kbisService;
    }

    public function __invoke(Request $request): Response
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
