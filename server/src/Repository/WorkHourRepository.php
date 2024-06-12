<?php

namespace App\Repository;

use App\Entity\WorkHour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WorkHour>
 *
 * @method WorkHour|null find($id, $lockMode = null, $lockVersion = null)
 * @method WorkHour|null findOneBy(array $criteria, array $orderBy = null)
 * @method WorkHour[]    findAll()
 * @method WorkHour[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WorkHourRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WorkHour::class);
    }

    public function findByEmployee($employeeId)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.employee = :employeeId')
            ->setParameter('employeeId', $employeeId)
            ->getQuery()
            ->getResult();
    }

    public function findConflictsWorkHours($startTime, $endTime, $employee)
    {
        return $this->createQueryBuilder('wh')
            ->andWhere('wh.employee = :employee')
            ->andWhere('wh.startTime < :endTime')
            ->andWhere('wh.endTime > :startTime')
            ->setParameter('employee', $employee)
            ->setParameter('startTime', $startTime)
            ->setParameter('endTime', $endTime)
            ->getQuery()
            ->getResult();
    }
//    /**
//     * @return WorkHour[] Returns an array of WorkHour objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('w.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?WorkHour
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
