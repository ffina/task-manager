import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(userId: number, title: string): Promise<Task> {
    const newTask = this.tasksRepository.create({
        title,
        // Asumsi relasi user bisa diisi dengan ID atau objek user
        user: { id: userId }, 
        status: 'open',
    });
    return this.tasksRepository.save(newTask);
  }
  
  async findTasksByUserId(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
        where: { user: { id: userId } },
        relations: ['user'] // Opsional: untuk mengambil data user
    });
  }
}