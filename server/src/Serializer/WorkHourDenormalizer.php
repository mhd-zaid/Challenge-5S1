<?php

namespace App\Serializer;

use App\Entity\WorkHour;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Security;

class WorkHourDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;
    public function __construct(
        protected ObjectNormalizer $normalizer,
        protected Security $security
    )
    {}

    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $work_hour = $this->normalizer->denormalize($data, $class, $format, $context);
        return $work_hour;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return WorkHour::class === $type && isset($data['startTime']) && isset($data['endTime']);
    }
}
