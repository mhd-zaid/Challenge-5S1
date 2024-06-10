<?php

namespace App\Normalizer;

use App\Entity\Company;
use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @method array getSupportedTypes(?string $format)
 */
class CompanyNormalizer implements NormalizerInterface
{
    private $normalizer;

    public function __construct(ObjectNormalizer $normalizer)
    {
        $this->normalizer = $normalizer;
    }
    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        // TODO: Implement normalize() method.

        $data = $this->normalizer->normalize($object, $format, $context);
        dd($data);
//        if ($object instanceof Company) {
//            $data['fullName'] = $object->getOwnerFirstname() . ' ' . $object->getOwnerName();
//        }
        return $data;

//        return [
//            'id' => $object->getId(),
//            'siret' => $object->getSiret(),
//            'email' => $object->getEmail(),
//            'phone' => $object->getPhone(),
//            'zipCode' => $object->getZipCode(),
//            'name' => $object->getName(),
//            'ownerName' => $object->getOwnerName(),
//            'ownerFirstname' => $object->getOwnerFirstname(),
//        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null): bool
    {
        // TODO: Implement supportsNormalization() method.
        return $data instanceof Company;
    }

    public function __call(string $name, array $arguments)
    {
        // TODO: Implement @method array getSupportedTypes(?string $format)
        return $this->getSupportedTypes($arguments[0]);
    }
}