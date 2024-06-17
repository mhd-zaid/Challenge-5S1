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
    private $inseeSiretApiUrl;
    private $inseeSirenApiUrl;
    private $inseeApiKey;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
        $this->inseeSiretApiUrl = $_ENV['INSEE_SIRET_API_URL'];
        $this->inseeSirenApiUrl = $_ENV['INSEE_SIREN_API_URL'];
        $this->inseeApiKey = $_ENV['INSEE_API_KEY'];
    }


    public function getStudioInfo(string $siret): array
    {
        $response = $this->httpClient->request('GET', "$this->inseeSiretApiUrl$siret?date=2999-12-31", [
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
            "data"  => $this->mapStudioData($data)
        ];

    }

    private function mapStudioData(array $data): array
    {
        return [
            "siren" => $data['etablissement']['siren'],
            "siret" => $data['etablissement']['siret'],
            "denominationUniteLegale" => $data['etablissement']['uniteLegale']['denominationUniteLegale'],
            "dateCreationEtablissement" => $data['etablissement']['dateCreationEtablissement'],
            "numeroVoieEtablissement" => $data['etablissement']['adresseEtablissement']['numeroVoieEtablissement'],
            "typeVoieEtablissement" => $data['etablissement']['adresseEtablissement']['typeVoieEtablissement'],
            "libelleVoieEtablissement" => $data['etablissement']['adresseEtablissement']['libelleVoieEtablissement'],
            "codePostalEtablissement" => $data['etablissement']['adresseEtablissement']['codePostalEtablissement'],
            "libelleCommuneEtablissement" => $data['etablissement']['adresseEtablissement']['libelleCommuneEtablissement'],
        ];
    }

    public function getCompanyInfo(string $siren): array
    {
        $response = $this->httpClient->request('GET', "$this->inseeSirenApiUrl$siren?date=2999-12-31", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->inseeApiKey
            ]
        ]);

        if($response->getStatusCode() !== 200) {
            return ['status' => 'invalid'];
        }

        $data = $response->toArray();
        $etatAdministratifUniteLegale = $data['uniteLegale']['periodesUniteLegale'][0]['etatAdministratifUniteLegale'];

        if ($etatAdministratifUniteLegale !== 'A')
        {
            return ['status' => 'invalid'];
        }

        return [
            "status" => "valid",
            "data"  => $this->mapCompanyData($data)
        ];
    }

    private function mapCompanyData(array $data): array
    {
        return [
            "siren" => $data['uniteLegale']['siren'],
            "sigleUniteLegale" => $data['uniteLegale']['sigleUniteLegale'],
            "denominationUniteLegale" => $data['uniteLegale']['periodesUniteLegale'][0]['denominationUniteLegale'],
            "dateCreationUniteLegale" => $data['uniteLegale']['dateCreationUniteLegale'],
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