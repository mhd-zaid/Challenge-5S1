<?php

namespace App\Repository;

use App\Entity\Reservation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

/**
 * @extends ServiceEntityRepository<Reservation>
 *
 * @method Reservation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Reservation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Reservation[]    findAll()
 * @method Reservation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReservationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

    public function findByEmployeeAndDateRange(User $employee, \DateTime $startDate, \DateTime $endDate)
    {
        return $this->createQueryBuilder('r')
            ->where('r.employee = :employee')
            ->andWhere('r.date BETWEEN :start AND :end')
            // ->andWhere('r.status = :status')
            ->setParameter('employee', $employee)
            ->setParameter('start', $startDate->format('Y-m-d 00:00:00'))
            ->setParameter('end', $endDate->format('Y-m-d 23:59:59'))
            // ->setParameter('status', 'RESERVED')
            ->getQuery()
            ->getResult();
    }

    public function findByEmployeeAndDate(User $employee, \DateTime $date)
    {
        return $this->createQueryBuilder('r')
            ->where('r.employee = :employee')
            ->andWhere('r.date BETWEEN :start AND :end')
            // ->andWhere('r.status = :status')
            ->setParameter('employee', $employee)
            ->setParameter('start', $date->format('Y-m-d 00:00:00'))
            ->setParameter('end', $date->format('Y-m-d 23:59:59'))
            // ->setParameter('status', 'RESERVED')
            ->getQuery()
            ->getResult();
    }
    

//    /**
//     * @return Reservation[] Returns an array of Reservation objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Reservation
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
