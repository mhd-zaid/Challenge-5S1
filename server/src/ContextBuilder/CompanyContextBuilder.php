<?php

namespace App\Serializer;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use App\Entity\Company;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class CompanyContextBuilder implements SerializerContextBuilderInterface
{

    public function __construct(
        private SerializerContextBuilderInterface $decorated
        , private AuthorizationCheckerInterface $authorizationChecker
    )
    {}

    public function createFromRequest(Request $request, bool $normalization, ?array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        $resourceClass = $context['resource_class'] ?? null;

//            dd($context['groups']);
        if ($resourceClass === Company::class && isset($context['groups'])){
            if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
                $context['groups'] = ['company:read:admin'];
            } elseif ($this->authorizationChecker->isGranted('ROLE_PRESTA')) {
                $context['groups'] = ['company:read:presta'];
            } elseif ($this->authorizationChecker->isGranted('ROLE_EMPLOYEE')) {
                $context['groups'] = ['company:read:employee'];
            } elseif ($this->authorizationChecker->isGranted('ROLE_CUSTOMER')) {
                $context['groups'] = ['company:read:customer'];
            }
            $context['groups'][] = 'company:read:customer';
        }

        return $context;
    }
}