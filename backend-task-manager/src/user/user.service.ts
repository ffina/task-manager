import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(currentUserId: number, search?: string) {
    const where: any = {
      id: { not: currentUserId }, // Exclude current user
    };

    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { fullName: { contains: search } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarPath: true,
        createdAt: true,
      },
      orderBy: {
        username: 'asc',
      },
    });
  }

  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarPath: true,
        createdAt: true,
        _count: {
          select: {
            tasks: { where: { isPublic: true } },
          },
        },
      },
    });
  }

  async findUserPublicTasks(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          userId,
          isPublic: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.task.count({
        where: {
          userId,
          isPublic: true,
        },
      }),
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

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarPath: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: number,
    updateData: {
      fullName?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
      avatarPath?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If changing password, verify current password
    if (updateData.newPassword && updateData.currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        updateData.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(updateData.newPassword, 10);
      updateData['password'] = hashedPassword;
    }

    // Remove password fields from updateData before update
    delete updateData.currentPassword;
    delete updateData.newPassword;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarPath: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
