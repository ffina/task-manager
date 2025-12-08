import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './task-scheduler.service';
import { EmailTestController } from './email-test.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, EmailModule],
  controllers: [EmailTestController],
  providers: [TaskSchedulerService],
})
export class SchedulerModule {}
