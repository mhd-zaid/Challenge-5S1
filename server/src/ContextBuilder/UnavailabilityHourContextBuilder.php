<?php
namespace App\Serializer;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use App\Entity\UnavailabilityHour;

final class UnavailabilityHourContextBuilder implements SerializerContextBuilderInterface
{
    public function __construct(private SerializerContextBuilderInterface $decorated, private AuthorizationCheckerInterface $authorizationChecker)
    {}

    public function createFromRequest(Request $request, bool $normalization, ?array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        $resourceClass = $context['resource_class'] ?? null;

        if ($resourceClass === UnavailabilityHour::class && isset($context['groups']) && $this->authorizationChecker->isGranted('ROLE_PRESTA') && false === $normalization) {
            $context['groups'][] = 'unavailabilityHour:presta:write';
        }

        return $context;
    }
}
