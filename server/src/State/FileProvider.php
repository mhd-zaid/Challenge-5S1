<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;


class FileProvider implements ProviderInterface
{
    public function __construct(private ParameterBagInterface $parameterBag)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $baseDir = $this->parameterBag->get('kernel.project_dir') . '/files/kbis/';

        $filePath = realpath($baseDir . $uriVariables['path'] . '.pdf');

        if ($filePath === false || strpos($filePath, realpath($baseDir)) !== 0) {
            throw new NotFoundHttpException('File not found');
        }

        return new BinaryFileResponse($filePath, 200, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}