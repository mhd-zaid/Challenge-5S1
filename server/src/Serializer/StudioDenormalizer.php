<?php

namespace App\Serializer;

use App\Entity\Studio;
use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Security;

class StudioDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;
    public function __construct(
        protected ObjectNormalizer $normalizer,
        protected Security $security
    )
    {}

    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $studio = $this->normalizer->denormalize($data, $class, $format, $context);

        return $studio;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return Studio::class === $type && (strtoupper($context['operation']->getMethod()) === 'POST' || strtoupper($context['operation']->getMethod()) === 'PATCH');
    }
}
