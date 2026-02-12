import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Email already exists");

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      isActive: true,
    });

    const saved = await this.usersRepo.save(user);

    return {
      id: saved.id,
      email: saved.email,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async findAll() {
    return this.usersRepo.find({
      select: ["id", "email", "isActive", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      select: ["id", "email", "isActive", "createdAt", "updatedAt"],
    });

    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
