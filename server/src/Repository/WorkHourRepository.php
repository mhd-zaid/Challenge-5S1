<?php

namespace App\Repository;

use App\Entity\WorkHour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;


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

    public function findConflictsWorkHours(\DateTimeInterface $startTime, \DateTimeInterface $endTime, $employee, $ignoreId = null)
    {
        $qb = $this->createQueryBuilder('w')
            ->where('w.employee = :employee')
            ->andWhere('(w.startTime < :endTime AND w.endTime > :startTime)')
            ->setParameter('employee', $employee)
            ->setParameter('startTime', $startTime)
            ->setParameter('endTime', $endTime);

        if ($ignoreId) {
            $qb->andWhere('w.id != :ignoreId')
               ->setParameter('ignoreId', $ignoreId);
        }

        return $qb->getQuery()->getResult();
    }

    public function findByEmployeeAndDateRange(User $employee, \DateTime $startDate, \DateTime $endDate)
    {
        return $this->createQueryBuilder('wh')
            ->where('wh.employee = :employee')
            ->andWhere('wh.startTime BETWEEN :start AND :end')
            ->setParameter('employee', $employee)
            ->setParameter('start', $startDate->format('Y-m-d 00:00:00'))
            ->setParameter('end', $endDate->format('Y-m-d 23:59:59'))
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
