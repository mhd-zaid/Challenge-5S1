<?php

namespace App\Repository;

use App\Entity\UnavailabilityHour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

use App\Entity\User;

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
    public function findByEmployeeAndDateRange(User $employee, \DateTime $startDate, \DateTime $endDate)
    {
        return $this->createQueryBuilder('uh')
            ->where('uh.employee = :employee')
            ->andWhere('uh.startTime BETWEEN :start AND :end')
            ->andWhere('uh.status = :status')
            ->setParameter('employee', $employee)
            ->setParameter('start', $startDate->format('Y-m-d 00:00:00'))
            ->setParameter('end', $endDate->format('Y-m-d 23:59:59'))
            ->setParameter('status', 'Accepted')
            ->getQuery()
            ->getResult();
    }

    
    public function findByEmployeeAndDate(User $employee, \DateTime $date)
    {
        return $this->createQueryBuilder('uh')
            ->where('uh.employee = :employee')
            ->andWhere('uh.startTime BETWEEN :start AND :end')
            ->andWhere('uh.status = :status')
            ->setParameter('employee', $employee)
            ->setParameter('start', $date->format('Y-m-d 00:00:00'))
            ->setParameter('end', $date->format('Y-m-d 23:59:59'))
            ->setParameter('status', 'Accepted')
            ->getQuery()
            ->getResult();
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
