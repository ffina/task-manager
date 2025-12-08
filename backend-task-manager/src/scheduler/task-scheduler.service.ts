import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Run every day at 9 AM to send task reminders
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendTaskReminders() {
    this.logger.log('Running task reminder job...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
        completed: false,
      },
      include: {
        user: true,
      },
    });

    for (const task of tasks) {
      await this.emailService.sendTaskReminder(
        task.user.email,
        task.title,
        task.dueDate!,
      );
    }

    this.logger.log(`Sent ${tasks.length} task reminders`);
  }

  // Run every day at 8 AM to send daily summary
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailySummaries() {
    this.logger.log('Running daily summary job...');

    const users = await this.prisma.user.findMany({
      include: {
        tasks: {
          where: {
            completed: false,
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 10,
        },
      },
    });

    for (const user of users) {
      if (user.tasks.length > 0) {
        await this.emailService.sendDailySummary(
          user.email,
          user.username,
          user.tasks,
        );
      }
    }

    this.logger.log(
      `Sent ${users.filter((u) => u.tasks.length > 0).length} daily summaries`,
    );
  }

  // Manual trigger for testing - can be called via API
  async sendTestReminder(userId: number) {
    this.logger.log(`Sending test reminder for user ${userId}...`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          where: {
            completed: false,
            dueDate: { not: null },
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.tasks.length === 0) {
      this.logger.log('No tasks with due date found for this user');
      return { message: 'No tasks with due date found' };
    }

    const task = user.tasks[0];
    await this.emailService.sendTaskReminder(
      user.email,
      task.title,
      task.dueDate!,
    );

    this.logger.log(`Test reminder sent to ${user.email}`);
    return { message: 'Test email sent successfully', task: task.title };
  }

  // Manual trigger for daily summary
  async sendTestSummary(userId: number) {
    this.logger.log(`Sending test summary for user ${userId}...`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          where: {
            completed: false,
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.tasks.length === 0) {
      this.logger.log('No pending tasks found for this user');
      return { message: 'No pending tasks found' };
    }

    await this.emailService.sendDailySummary(
      user.email,
      user.username,
      user.tasks,
    );

    this.logger.log(`Test summary sent to ${user.email}`);
    return {
      message: 'Test email sent successfully',
      tasksCount: user.tasks.length,
    };
  }
}
