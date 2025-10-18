import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

export interface FindUsersOptions {
  role?: UserRole;
  search?: string;
  skip?: number;
  take?: number;
  isActive?: boolean;
}

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 🔹 CREATE
  async insertUser(user: Partial<User>): Promise<User> {
    const newUser = this.create(user);
    return this.save(newUser);
  }

  // 🔹 READ
  async findAllUsers(): Promise<User[]> {
    return this.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findUsers(options: FindUsersOptions): Promise<[User[], number]> {
    const { role, search, skip = 0, take = 10, isActive } = options;
    const queryBuilder = this.createQueryBuilder('users');

    if (role) {
      queryBuilder.andWhere('users.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('users.is_active = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(users.username LIKE :search OR users.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('users.created_at', 'DESC').skip(skip).take(take);
    return queryBuilder.getManyAndCount();
  }

  // 🔹 UPDATE
  async updateUser(
    id: number,
    updatedData: Partial<User>,
  ): Promise<User | null> {
    const user = await this.findUserById(id);
    if (!user) return null;

    Object.assign(user, updatedData);
    return this.save(user);
  }

  // 🔹 DELETE
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
