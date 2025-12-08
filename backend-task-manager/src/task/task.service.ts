import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto,
    file?: Express.Multer.File,
  ) {
    const { categoryId, ...taskData } = createTaskDto;

    // Validate category belongs to user if provided
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException(
          'Category not found or does not belong to you',
        );
      }
    }

    return this.prisma.task.create({
      data: {
        ...taskData,
        userId,
        categoryId: categoryId || null,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        filePath: file?.path,
        fileName: file?.originalname,
        status: 'pending',
      },
      include: {
        category: true,
      },
    });
  }

  async findAllUserTasks(userId: number, filterDto: FilterTaskDto) {
    const {
      search,
      priority,
      status,
      categoryId,
      dueDateFrom,
      dueDateTo,
      page = 1,
      limit = 10,
    } = filterDto;

    const where: any = { userId };

    if (search) {
      where.title = { contains: search };
    }

    if (priority) {
      where.priority = priority;
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) {
        where.dueDate.gte = new Date(dueDateFrom);
      }
      if (dueDateTo) {
        where.dueDate.lte = new Date(dueDateTo);
      }
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findTaskById(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Allow access if user owns the task or task is public
    if (task.userId !== userId && !task.isPublic) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async updateTask(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    const { categoryId, ...updateData } = updateTaskDto;

    // Validate category if provided
    if (categoryId !== undefined) {
      if (categoryId !== null) {
        const category = await this.prisma.category.findFirst({
          where: { id: categoryId, userId },
        });
        if (!category) {
          throw new NotFoundException(
            'Category not found or does not belong to you',
          );
        }
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        categoryId: categoryId !== undefined ? categoryId : task.categoryId,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : task.dueDate,
        status:
          updateTaskDto.completed !== undefined
            ? updateTaskDto.completed
              ? 'completed'
              : 'pending'
            : task.status,
      },
      include: {
        category: true,
      },
    });
  }

  async toggleTaskCompletion(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'pending',
      },
    });
  }

  async deleteTask(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}
