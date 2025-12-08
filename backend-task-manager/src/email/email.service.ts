import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('EMAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    // Verify connection on startup
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Email service connected successfully');
    } catch (error) {
      this.logger.error(`❌ Email service connection failed: ${error.message}`);
    }
  }

  async sendTaskReminder(to: string, taskTitle: string, dueDate: Date) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@taskmanager.com'),
        to,
        subject: `Task Reminder: ${taskTitle}`,
        html: `
          <h2>Task Reminder</h2>
          <p>Your task "<strong>${taskTitle}</strong>" is due tomorrow.</p>
          <p>Due Date: ${dueDate.toLocaleDateString()}</p>
          <p>Don't forget to complete it!</p>
        `,
      });
      this.logger.log(`Reminder email sent to ${to} for task: ${taskTitle}`);
    } catch (error) {
      this.logger.error(`Failed to send reminder email: ${error.message}`);
    }
  }

  async sendDailySummary(to: string, username: string, pendingTasks: any[]) {
    try {
      const taskList = pendingTasks
        .map(
          (task) =>
            `<li><strong>${task.title}</strong> - Priority: ${task.priority}, Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</li>`,
        )
        .join('');

      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@taskmanager.com'),
        to,
        subject: 'Your Daily Task Summary',
        html: `
          <h2>Hello ${username}!</h2>
          <p>Here's your daily task summary:</p>
          <h3>Pending Tasks (${pendingTasks.length})</h3>
          ${pendingTasks.length > 0 ? `<ul>${taskList}</ul>` : '<p>No pending tasks. Great job!</p>'}
        `,
      });
      this.logger.log(`Daily summary email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send daily summary email: ${error.message}`);
    }
  }
}
