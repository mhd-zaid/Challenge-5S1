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

class CompanyPostStateProcessor implements ProcessorInterface
{
    public function  __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $em
    )
    {}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if($operation->getUriTemplate() === '/companies' && $operation instanceof Post && $data instanceof Company) {
            $request = $context['request'];
            if($request->files->has('file')) {
                $file = $request->files->get('file');
            }else{
                return \InvalidArgumentException::class;
            }

            $params = $request->request->all();
            $user = new User();
            $user->setLastname($params['ownerName']);
            $user->setFirstname($params['ownerFirstname']);
            $user->setEmail($params['ownerEmail']);
            $user->setPhone($params['ownerPhone']);
            $user->setRoles(['ROLE_PRESTA']);
            $user->setPlainPassword($params['password']);
            $this->em->persist($user);

            $mediaObject = new MediaObject();
            $mediaObject->setFile($file);
            $this->em->persist($mediaObject);

            $data->setOwner($user);
            $data->setKbis($mediaObject);
            $this->em->persist($data);

			$user->setCompany($data);
            $this->em->persist($user);
            $this->em->flush();
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}