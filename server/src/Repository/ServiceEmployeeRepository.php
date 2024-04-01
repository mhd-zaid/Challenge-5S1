<?php

namespace App\Repository;

use App\Entity\ServiceEmployee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ServiceEmployee>
 *
 * @method ServiceEmployee|null find($id, $lockMode = null, $lockVersion = null)
 * @method ServiceEmployee|null findOneBy(array $criteria, array $orderBy = null)
 * @method ServiceEmployee[]    findAll()
 * @method ServiceEmployee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ServiceEmployeeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ServiceEmployee::class);
    }

    //    /**
    //     * @return ServiceEmployee[] Returns an array of ServiceEmployee objects
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

    //    public function findOneBySomeField($value): ?ServiceEmployee
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
