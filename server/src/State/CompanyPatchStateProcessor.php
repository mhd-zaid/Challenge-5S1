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
            if (isset($context['resource_data'])) {

                $patchData = $context['resource_data'];

                if (isset($patchData['status'])) {
                    $data->setStatus($patchData['status']);
                }
            }

            $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        return $data;
    }
}
