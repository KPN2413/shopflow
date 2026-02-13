import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // adjust path

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findByEmailWithPassword(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'isActive', 'role'], // ensure passwordHash is selectable
    });
  }

  async createWithPassword(email: string, password: string) {
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const user = this.repo.create({
      email,
      passwordHash,
      isActive: true,
    });

    return this.repo.save(user);
  }

  async findAllSafe() {
    return this.repo.find({
      select: ['id', 'email', 'isActive', 'createdAt', 'updatedAt'] as any,
    });
  }

  async findOneSafe(id: string) {
    return this.repo.findOne({
      where: { id } as any,
      select: ['id', 'email', 'isActive', 'createdAt', 'updatedAt'] as any,
    });
  }
}
