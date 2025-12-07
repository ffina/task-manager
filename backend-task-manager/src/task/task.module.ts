import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { AuthModule } from '../auth/auth.module'; // Diperlukan untuk JwtAuthGuard

@Module({
  imports: [
    // 1. Daftarkan Entitas Task untuk TypeORM
    TypeOrmModule.forFeature([Task]),
    // 2. Impor AuthModule karena TaskController menggunakan JwtAuthGuard
    AuthModule, 
  ],
  controllers: [TaskController],
  
  // 3. SOLUSI: Daftarkan TaskService di array providers
  providers: [TaskService] 
})
export class TaskModule {}