import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskSchedulerService } from './task-scheduler.service';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailTestController {
  constructor(private readonly schedulerService: TaskSchedulerService) {}

  @Post('test-reminder')
  async testReminder(@Request() req) {
    return this.schedulerService.sendTestReminder(req.user.userId);
  }

  @Post('test-summary')
  async testSummary(@Request() req) {
    return this.schedulerService.sendTestSummary(req.user.userId);
  }
}
