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
            ->andWhere(':start BETWEEN uh.startTime AND uh.endTime')
            ->andWhere('uh.status = :status')
            ->setParameter('employee', $employee)
            ->setParameter('start', $startDate)
            ->setParameter('status', 'Accepted')
            ->getQuery()
            ->getResult();
    }
}
