<?php

namespace App\ContextBuilder;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use App\Entity\Company;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class CompanyContextBuilder implements SerializerContextBuilderInterface
{

    public function __construct(
        private SerializerContextBuilderInterface $decorated
        , private AuthorizationCheckerInterface $authorizationChecker
        , private Security $security
    )
    {}

    public function createFromRequest(Request $request, bool $normalization, ?array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        $resourceClass = $context['resource_class'] ?? null;

//        if ($request->getMethod() === 'POST' || $request->getMethod() === 'PUT') {
//            dd($context);
//        }

        if ($resourceClass === Company::class && isset($context['groups'])){
            if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
                $context['groups'] = ['company:read:admin'];
            } elseif ($this->authorizationChecker->isGranted('ROLE_PRESTA')) {
                $context['groups'][] = 'company:read:presta';
            } elseif ($this->authorizationChecker->isGranted('ROLE_EMPLOYEE')) {
                $context['groups'][] = 'company:read:employee';
            } elseif ($this->authorizationChecker->isGranted('ROLE_CUSTOMER')) {
                $context['groups'] = ['company:read:customer'];
            }
        }

//        dd($context['groups']);

        return $context;
    }
}