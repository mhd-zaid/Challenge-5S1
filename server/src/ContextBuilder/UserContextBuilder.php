<?php

namespace App\ContextBuilder;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use App\Entity\Company;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class UserContextBuilder implements SerializerContextBuilderInterface
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

        if (($resourceClass === User::class) && isset($context['groups']) && $context['operation']->getMethod() === 'POST'){
            if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
                $context['groups'][] = 'user:input:admin';
            } 
        }
        return $context;
    }
}