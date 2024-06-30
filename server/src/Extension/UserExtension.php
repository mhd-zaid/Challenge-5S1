<?php
namespace App\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class UserExtension implements QueryCollectionExtensionInterface
{
    public function __construct(
        private Security $security,
    )
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (User::class !== $resourceClass || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        if ($this->security->isGranted('ROLE_ADMIN')) {
            $queryBuilder->andWhere(sprintf('%s.id != :currentUserId', $rootAlias))
                ->setParameter('currentUserId', $user->getId());
        } elseif ($this->security->isGranted('ROLE_PRESTA')) {
            $company = $user->getCompany();
            if ($company !== null) {
                $queryBuilder->andWhere(sprintf('%s.company = :current_user', $rootAlias));
                $queryBuilder->setParameter('current_user', $company->getId());

                $queryBuilder->andWhere(sprintf('%s.id != :company_owner', $rootAlias));
                $queryBuilder->setParameter('company_owner', $company->getOwner()->getId());            
            }
        } else {
            $queryBuilder->andWhere(sprintf('%s.employee = :current_user', $rootAlias));
            $queryBuilder->setParameter('current_user', $user->getId());
        }
    }
}
