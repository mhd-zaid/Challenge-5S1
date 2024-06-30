<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\Kbis;
use App\ApiResource\KbisCompany;
use App\ApiResource\KbisStudio;
use App\Service\KbisService;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;

class KbisStateProvider implements ProviderInterface
{

    public function __construct(
        private KbisService $kbisService
        , private RequestStack $requestStack
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $request = $this->requestStack->getCurrentRequest();
        $siret = $request->attributes->get('siret');
        $siren = $request->attributes->get('siren');

        if ($siret && strlen($siret) === 14) {
            $data = $this->kbisService->getStudioInfo($siret);
            if($data['status'] === 'invalid'){
                return new Response('Invalid SIRET', Response::HTTP_NOT_FOUND);
            }
            $kbis = $this->mapStudioDataToKbis($data);
        } elseif ($siren && strlen($siren) === 9) {
            $data = $this->kbisService->getCompanyInfo($siren);
            if($data['status'] === 'invalid'){
                return new Response('Invalid SIREN', Response::HTTP_NOT_FOUND);
            }
            $kbis = $this->mapCompanyDataToKbis($data);
        } else {
            throw new \InvalidArgumentException('Invalid parameter');
        }

        return $kbis;
    }

    private function mapCompanyDataToKbis(array $data): KbisCompany
    {
        $kbis = new KbisCompany();
        $kbis->setSiren($data['data']['siren']);
        $kbis->setSigleUniteLegale($data['data']['sigleUniteLegale']);
        $kbis->setDenominationUniteLegale($data['data']['denominationUniteLegale']);
        $kbis->setDateCreationUniteLegale($data['data']['dateCreationUniteLegale']);

        return $kbis;
    }

    private function mapStudioDataToKbis(array $data): KbisStudio
    {
        $kbis = new KbisStudio();
        $kbis->setSiren($data['data']['siren']);
        $kbis->setSiret($data['data']['siret']);
        $kbis->setDenominationUniteLegale($data['data']['denominationUniteLegale']);
        $kbis->setDateCreationEtablissement($data['data']['dateCreationEtablissement']);
        $kbis->setNumeroVoieEtablissement($data['data']['numeroVoieEtablissement']);
        $kbis->setTypeVoieEtablissement($data['data']['typeVoieEtablissement']);
        $kbis->setLibelleVoieEtablissement($data['data']['libelleVoieEtablissement']);
        $kbis->setCodePostalEtablissement($data['data']['codePostalEtablissement']);
        $kbis->setLibelleCommuneEtablissement($data['data']['libelleCommuneEtablissement']);

        return $kbis;
    }
}
