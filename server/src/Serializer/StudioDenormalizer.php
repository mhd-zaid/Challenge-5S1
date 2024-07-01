<?php

namespace App\Serializer;

use App\Entity\Studio;
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

         if($this->security->isGranted('ROLE_PRESTA')){
            $studio->setCompany($this->security->getUser()->getCompany());
        }  
        return $studio;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return Studio::class === $type && strtoupper($context['operation']->getMethod()) === 'POST' && "/api/studios" === $context['request_uri'];
    }
}
