import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

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
    return this.findOne({ where: { user_id: id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
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
