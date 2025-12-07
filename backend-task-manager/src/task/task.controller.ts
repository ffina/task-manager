import { Controller, Post, Body, UseGuards, Request, Get, HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import Guard
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Semua rute di sini dilindungi
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Rute ini hanya bisa diakses oleh user yang sudah login
  @Post()
  async create(@Body('title') title: string, @Request() req) {
    // Implement authorization guards/middleware
    // req.user berisi user yang sedang login (dari JwtStrategy)
    const userId = req.user.id; 
    
    // Contoh implementasi Role-Based Access Control (RBAC) jika diperlukan
    if (req.user.role === 'admin') {
      // Logika khusus admin
    } else if (req.user.role !== 'user') {
        // Return appropriate HTTP status codes (403 Forbidden)
        throw new HttpException('Anda tidak memiliki izin', HttpStatus.FORBIDDEN);
    }

    return this.taskService.createTask(userId, title);
  }

  @Get()
  findAll(@Request() req) {
    // User hanya bisa melihat task milik mereka sendiri (otorisasi)
    const userId = req.user.id;
    return this.taskService.findTasksByUserId(userId);
  }
}