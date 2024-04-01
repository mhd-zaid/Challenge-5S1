<?php

namespace App\Repository;

use App\Entity\StudioOpeningTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StudioOpeningTime>
 *
 * @method StudioOpeningTime|null find($id, $lockMode = null, $lockVersion = null)
 * @method StudioOpeningTime|null findOneBy(array $criteria, array $orderBy = null)
 * @method StudioOpeningTime[]    findAll()
 * @method StudioOpeningTime[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StudioOpeningTimeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StudioOpeningTime::class);
    }

    //    /**
    //     * @return StudioOpeningTime[] Returns an array of StudioOpeningTime objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?StudioOpeningTime
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
