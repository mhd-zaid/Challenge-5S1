<?php

namespace App\Serializer;

use App\Entity\Reservation;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Security;

class ReservationDenormalizer implements DenormalizerInterface
{
    use DenormalizerAwareTrait;
    public function __construct(
        protected ObjectNormalizer $normalizer,
        protected Security $security
    )
    {}

    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $reservation = $this->normalizer->denormalize($data, $class, $format, $context);

        if ($this->security->isGranted('ROLE_CUSTOMER')) {
            $reservation->setCustomer($this->security->getUser());
        } 

        return $reservation;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return Reservation::class === $type && strtoupper($context['operation']->getMethod()) === 'POST' && "/api/reservations" === $context['request_uri'];
    }
}
