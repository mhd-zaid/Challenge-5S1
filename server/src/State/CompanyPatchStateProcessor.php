<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Company;
use App\Entity\MediaObject;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use function PHPUnit\Framework\isInstanceOf;

class CompanyPatchStateProcessor implements ProcessorInterface
{
    public function  __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $em
    )
    {}
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof Company) {
            // Vérifiez si des données ont été envoyées dans la requête PATCH
//                dd($context['request']['content']);
            if (isset($context['resource_data'])) {

                $patchData = $context['resource_data'];

                // Exemple : Si isActive est envoyé dans le corps de la requête PATCH
                if (isset($patchData['isActive'])) {
                    $data->setActive($patchData['isActive']);
                }
            }

            // Utilisation du persistProcessor pour sauvegarder les modifications
            $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        return $data;
    }
}
