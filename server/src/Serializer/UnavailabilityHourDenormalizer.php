<?php

namespace App\Serializer;

use App\Entity\UnavailabilityHour;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Security;

class UnavailabilityHourDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;
    public function __construct(
        protected ObjectNormalizer $normalizer,
        protected Security $security
    )
    {}

    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $unavailability_hour = $this->normalizer->denormalize($data, $class, $format, $context);
        
        if($this->security->isGranted('ROLE_PRESTA')) {
            $unavailability_hour->setStatus('Accepted');
        } else {
            $unavailability_hour->setEmployee($this->security->getUser());
            $unavailability_hour->setStatus('Pending');
        }

        $dateStart = (new \DateTime($data['startTime']))->setTime(0, 0, 0);
        $dateEnd = (new \DateTime($data['endTime']))->setTime(23, 59, 59);
        $unavailability_hour->setStartTime($dateStart);
        $unavailability_hour->setEndTime($dateEnd);

        return $unavailability_hour;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return UnavailabilityHour::class === $type&& strtoupper($context['operation']->getMethod()) === 'POST' && "/api/unavailability_hours" === $context['request_uri'];
    }
}
