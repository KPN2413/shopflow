import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../redis/redis.module';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UsersModule,
    RedisModule,
    PassportModule,
    JwtModule.register({}), // we pass secrets per-sign in AuthService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
