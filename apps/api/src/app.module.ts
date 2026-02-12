import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "./health/health.controller";
import { HealthService } from "./health/health.service";
import { configuration } from "./config/configuration";
import { RedisModule } from "./redis/redis.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [configuration],
    }),
    RedisModule, 
    UsersModule,  
    AuthModule,


    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.getOrThrow("db") as {
          host: string;
          port: number;
          user: string;
          password: string;
          name: string;
        };

        return {
          type: "postgres",
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.name,
          autoLoadEntities: true,
          synchronize: false, // Step 5.3.3: make false + add migrations
        };
      },
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  
})
export class AppModule {}
