import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Basic admin/dev endpoint (creates user with password hashing)
  @Post()
  create(@Body() dto: { email: string; password: string }) {
    return this.usersService.createWithPassword(dto.email, dto.password);
  }

  @Get()
  findAll() {
    return this.usersService.findAllSafe();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneSafe(id);
  }
}
