import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Database
    PrismaModule,

    // Feature Modules
    AuthModule,
    TaskModule,
    CategoryModule,
    UserModule,
    EmailModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
