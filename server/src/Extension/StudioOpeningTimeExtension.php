<?php
namespace App\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\StudioOpeningTime;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class StudioOpeningTimeExtension implements QueryCollectionExtensionInterface
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
        if (StudioOpeningTime::class !== $resourceClass || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        } elseif ($this->security->isGranted('ROLE_PRESTA')) {
            $company = $user->getCompany();
            $studios = $company->getStudios();
            if($company !== null){
                $queryBuilder->andWhere(sprintf('%s.studio IN (:studios)', $rootAlias));
                $queryBuilder->setParameter('studios', $studios);
            }
        }
    }
}
