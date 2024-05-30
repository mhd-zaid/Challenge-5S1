<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Symfony\Contracts\HttpClient\ResponseStreamInterface;

class KbisService
{
    private $httpClient;
    private $inseeApiUrl;
    private $inseeApiKey;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
        $this->inseeApiUrl = getenv("INSEE_API_URL");
        $this->inseeApiKey = getenv("INSEE_API_KEY");
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getKbisInfo(string $siret): array
    {
        $response = $this->httpClient->request('GET', "$this->inseeApiUrl$siret?date=2999-12-31", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->inseeApiKey
            ]
        ]);

        if($response->getStatusCode() !== 200) {
            return ['status' => 'invalid'];
        }

        $data = $response->toArray();


        $etatAdministratifUniteLegale = $data['etablissement']['uniteLegale']['etatAdministratifUniteLegale'];

        if ($etatAdministratifUniteLegale !== 'A'
            || !$this->hasActiveEtablissement($data['etablissement']))
        {
            return ['status' => 'invalid'];
        }

        return [
            "status" => "valid",
            "data"  => [
                "siren" => $data['etablissement']['siren'],
                "siret" => $siret,
                "denominationUniteLegale" => $data['etablissement']['uniteLegale']['denominationUniteLegale'],
                "categorieJuridiqueUniteLegale" => $data['etablissement']['uniteLegale']['categorieJuridiqueUniteLegale'],
                "activitePrincipaleUniteLegale" => $data['etablissement']['uniteLegale']['activitePrincipaleUniteLegale'],
                "nomenclatureActivitePrincipaleUniteLegale" => $data['etablissement']['uniteLegale']['nomenclatureActivitePrincipaleUniteLegale'],
                "dateCreationEtablissement" => $data['etablissement']['dateCreationEtablissement'],
                "numeroVoieEtablissement" => $data['etablissement']['adresseEtablissement']['numeroVoieEtablissement'],
                "typeVoieEtablissement" => $data['etablissement']['adresseEtablissement']['typeVoieEtablissement'],
                "libelleVoieEtablissement" => $data['etablissement']['adresseEtablissement']['libelleVoieEtablissement'],
                "codePostalEtablissement" => $data['etablissement']['adresseEtablissement']['codePostalEtablissement'],
                "libelleCommuneEtablissement" => $data['etablissement']['adresseEtablissement']['libelleCommuneEtablissement'],
            ]
        ];

    }

    public function hasActiveEtablissement(array $etablissements): bool
    {
        foreach ($etablissements as $etablissement) {
            if ($etablissement) {
                return true;
            }
        }
        return false;
    }
}