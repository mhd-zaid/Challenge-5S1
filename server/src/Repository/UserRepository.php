<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Connection;
use Doctrine\Persistence\ManagerRegistry;
/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, Connection $connection)
    {
        parent::__construct($registry, User::class);
        $this->connection = $connection;
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param string $role
     * @return User[]
     */
    public function findByRole(string $role): array
    {
        $sql = 'SELECT * FROM "utilisateur" WHERE roles::jsonb @> :role';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('role', json_encode([$role]));

        $results = $stmt->executeQuery()->fetchAllAssociative();
        $users = [];
        foreach ($results as $data) {
            $user = $this->getEntityManager()->getRepository(User::class)->find($data['id']);
            if ($user !== null) {
                $users[] = $user;
            }
        }
        return $users;
    }
}