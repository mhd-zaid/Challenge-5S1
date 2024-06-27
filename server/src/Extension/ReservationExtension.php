<?php
namespace App\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Reservation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class UnavailabilityHourExtension implements QueryCollectionExtensionInterface
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
        if (Reservation::class !== $resourceClass || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        } elseif ($this->security->isGranted('ROLE_PRESTA')) {
            $company = $user->getCompany();
            if ($company !== null) {
                $queryBuilder->join(sprintf('%s.employee', $rootAlias), 'e');
                $queryBuilder->join('e.company', 'c');
                $queryBuilder->andWhere('c.id = :user_company');
                $queryBuilder->setParameter('user_company', $company->getId());
            }
        } else {
            $queryBuilder->andWhere(
            $queryBuilder->expr()->orX(
                sprintf('%s.employee = :current_user', $rootAlias),
                sprintf('%s.customer = :current_user', $rootAlias)
            )
            );            
            $queryBuilder->setParameter('current_user', $user->getId());
        }
    }
}
