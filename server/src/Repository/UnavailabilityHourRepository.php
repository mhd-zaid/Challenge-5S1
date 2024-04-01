<?php

namespace App\Repository;

use App\Entity\UnavailabilityHour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UnavailabilityHour>
 *
 * @method UnavailabilityHour|null find($id, $lockMode = null, $lockVersion = null)
 * @method UnavailabilityHour|null findOneBy(array $criteria, array $orderBy = null)
 * @method UnavailabilityHour[]    findAll()
 * @method UnavailabilityHour[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UnavailabilityHourRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UnavailabilityHour::class);
    }

    //    /**
    //     * @return UnavailabilityHour[] Returns an array of UnavailabilityHour objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UnavailabilityHour
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
