import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';

type JwtPayload = { sub: string; email: string };

@Injectable()
export class AuthService {
  private readonly accessTtl = '15m';
  private readonly refreshTtlMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createWithPassword(dto.email, dto.password);
    const tokens = await this.issueTokens(String(user.id), user.email);
    await this.storeRefreshHash(String(user.id), tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.isActive === false) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(String(user.id), user.email);
    await this.storeRefreshHash(String(user.id), tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = payload.sub;

    const storedHash = await this.redis.get(this.rtKey(userId));
    if (!storedHash) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(storedHash, refreshToken);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(userId, payload.email);
    await this.storeRefreshHash(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.redis.del(this.rtKey(userId));
    return { ok: true };
  }

  private async issueTokens(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.accessTtl,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private rtKey(userId: string) {
    return `auth:rt:${userId}`;
  }

  private async storeRefreshHash(userId: string, refreshToken: string) {
    const hash = await argon2.hash(refreshToken, { type: argon2.argon2id });
    await this.redis.set(this.rtKey(userId), hash, this.refreshTtlMs);
  }
}
