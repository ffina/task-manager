import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

describe('Task Manager API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: number;
  let categoryId: number;
  let taskId: number;
  let secondUserToken: string;
  let secondUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same configuration as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors();
    app.setGlobalPrefix('api');

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Clean up and close connections
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  describe('Authentication (Auth Module)', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user successfully', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            fullName: 'Test User',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('berhasil');
          });
      });

      it('should fail with duplicate email', async () => {
        await request(app.getHttpServer()).post('/api/auth/register').send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        });

        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            username: 'testuser2',
            password: 'password123',
          })
          .expect(400);
      });

      it('should fail with missing required fields', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
          })
          .expect(400);
      });

      it('should fail with invalid email format', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            username: 'testuser',
            password: 'password123',
          })
          .expect(400);
      });
    });

    describe('POST /api/auth/login', () => {
      beforeEach(async () => {
        await request(app.getHttpServer()).post('/api/auth/register').send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        });
      });

      it('should login successfully with valid credentials', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            authToken = res.body.accessToken;
            userId = res.body.user.id;
          });
      });

      it('should fail with invalid credentials', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should fail with non-existent user', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123',
          })
          .expect(401);
      });
    });
  });

  describe('Categories (Category Module)', () => {
    beforeEach(async () => {
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        });

      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      authToken = loginRes.body.accessToken;
      userId = loginRes.body.user.id;
    });

    describe('POST /api/categories', () => {
      it('should create a category with authentication', () => {
        return request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Work',
            color: '#FF5733',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', 'Work');
            expect(res.body).toHaveProperty('color', '#FF5733');
            categoryId = res.body.id;
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post('/api/categories')
          .send({
            name: 'Work',
          })
          .expect(401);
      });

      it('should fail with duplicate category name for same user', async () => {
        await request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Work',
          });

        return request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Work',
          })
          .expect(409);
      });
    });

    describe('GET /api/categories', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'Work', color: '#FF5733' });

        await request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'Personal', color: '#33FF57' });
      });

      it('should get all user categories', () => {
        return request(app.getHttpServer())
          .get('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer()).get('/api/categories').expect(401);
      });
    });

    describe('PUT /api/categories/:id', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'Work' });
        categoryId = res.body.id;
      });

      it('should update a category', () => {
        return request(app.getHttpServer())
          .put(`/api/categories/${categoryId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Updated Work',
            color: '#0000FF',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('name', 'Updated Work');
            expect(res.body).toHaveProperty('color', '#0000FF');
          });
      });
    });

    describe('DELETE /api/categories/:id', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/categories')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'Work' });
        categoryId = res.body.id;
      });

      it('should delete a category', () => {
        return request(app.getHttpServer())
          .delete(`/api/categories/${categoryId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });
    });
  });

  describe('Tasks (Task Module)', () => {
    beforeEach(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        })
        .then(() =>
          request(app.getHttpServer()).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
          }),
        );

      authToken = loginRes.body.accessToken;
      userId = loginRes.body.user.id;

      const categoryRes = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Work' });
      categoryId = categoryRes.body.id;
    });

    describe('POST /api/tasks', () => {
      it('should create a task with authentication', () => {
        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Complete project',
            description: 'Finish the task manager project',
            priority: 'high',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            categoryId: categoryId,
            isPublic: false,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('title', 'Complete project');
            expect(res.body).toHaveProperty('priority', 'high');
            taskId = res.body.id;
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post('/api/tasks')
          .send({
            title: 'Complete project',
          })
          .expect(401);
      });

      it('should fail with missing required fields', () => {
        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            description: 'No title provided',
          })
          .expect(400);
      });
    });

    describe('POST /api/tasks with file upload', () => {
      it('should create task with file upload', () => {
        const testFilePath = path.join(__dirname, 'test-image.jpg');

        // Create a simple test image buffer
        const testImageBuffer = Buffer.from(
          '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==',
          'base64',
        );

        if (!fs.existsSync(testFilePath)) {
          fs.writeFileSync(testFilePath, testImageBuffer);
        }

        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .field('title', 'Task with image')
          .field('priority', 'medium')
          .field('isPublic', 'false')
          .attach('file', testFilePath)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('filePath');
            expect(res.body).toHaveProperty('fileName');

            // Clean up test file
            if (fs.existsSync(testFilePath)) {
              fs.unlinkSync(testFilePath);
            }
          });
      });

      it('should fail with file size exceeding limit', () => {
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
        const testFilePath = path.join(__dirname, 'large-file.jpg');
        fs.writeFileSync(testFilePath, largeBuffer);

        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .field('title', 'Task with large file')
          .field('priority', 'medium')
          .attach('file', testFilePath)
          .expect(413)
          .then(() => {
            if (fs.existsSync(testFilePath)) {
              fs.unlinkSync(testFilePath);
            }
          });
      });
    });

    describe('GET /api/tasks', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Task 1',
            priority: 'high',
          });

        await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Task 2',
            priority: 'low',
          });
      });

      it('should get all user tasks', () => {
        return request(app.getHttpServer())
          .get('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('meta');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
          });
      });

      it('should filter tasks by priority', () => {
        return request(app.getHttpServer())
          .get('/api/tasks?priority=high')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(
              res.body.data.every((task) => task.priority === 'high'),
            ).toBe(true);
          });
      });

      it('should get tasks with pagination metadata', () => {
        return request(app.getHttpServer())
          .get('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('meta');
            expect(res.body.meta).toHaveProperty('total');
            expect(res.body.meta).toHaveProperty('page');
          });
      });

      it('should paginate tasks', () => {
        return request(app.getHttpServer())
          .get('/api/tasks?page=1&limit=1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.length).toBeLessThanOrEqual(1);
            expect(res.body.meta).toHaveProperty('page', 1);
            expect(res.body.meta).toHaveProperty('limit', 1);
          });
      });
    });

    describe('GET /api/tasks/:id', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            priority: 'medium',
          });
        taskId = res.body.id;
      });

      it('should get task by id', () => {
        return request(app.getHttpServer())
          .get(`/api/tasks/${taskId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', taskId);
            expect(res.body).toHaveProperty('title', 'Test Task');
          });
      });

      it('should return 404 for non-existent task', () => {
        return request(app.getHttpServer())
          .get('/api/tasks/999999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('PATCH /api/tasks/:id/toggle', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            priority: 'medium',
          });
        taskId = res.body.id;
      });

      it('should toggle task completion status', async () => {
        await request(app.getHttpServer())
          .patch(`/api/tasks/${taskId}/toggle`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('completed', true);
          });

        return request(app.getHttpServer())
          .patch(`/api/tasks/${taskId}/toggle`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('completed', false);
          });
      });
    });

    describe('PUT /api/tasks/:id', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            priority: 'medium',
          });
        taskId = res.body.id;
      });

      it('should update a task', () => {
        return request(app.getHttpServer())
          .put(`/api/tasks/${taskId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Updated Task',
            priority: 'high',
            description: 'Updated description',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('title', 'Updated Task');
            expect(res.body).toHaveProperty('priority', 'high');
          });
      });
    });

    describe('DELETE /api/tasks/:id', () => {
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            priority: 'medium',
          });
        taskId = res.body.id;
      });

      it('should delete a task', () => {
        return request(app.getHttpServer())
          .delete(`/api/tasks/${taskId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });
    });
  });

  describe('Users (User Module)', () => {
    beforeEach(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        })
        .then(() =>
          request(app.getHttpServer()).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
          }),
        );

      authToken = loginRes.body.accessToken;
      userId = loginRes.body.user.id;

      // Create second user
      await request(app.getHttpServer()).post('/api/auth/register').send({
        email: 'test2@example.com',
        username: 'testuser2',
        password: 'password123',
      });

      const secondLogin = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test2@example.com',
          password: 'password123',
        });

      secondUserToken = secondLogin.body.accessToken;
      secondUserId = secondLogin.body.user.id;
    });

    describe('GET /api/users', () => {
      it('should get all users except current user', () => {
        return request(app.getHttpServer())
          .get('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((user) => user.id !== userId)).toBe(true);
          });
      });

      it('should return users with required fields', () => {
        return request(app.getHttpServer())
          .get('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            if (res.body.length > 0) {
              expect(res.body[0]).toHaveProperty('id');
              expect(res.body[0]).toHaveProperty('username');
              expect(res.body[0]).toHaveProperty('email');
            }
          });
      });
    });

    describe('GET /api/users/:id', () => {
      it('should get user by id', () => {
        return request(app.getHttpServer())
          .get(`/api/users/${secondUserId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', secondUserId);
            expect(res.body).toHaveProperty('username', 'testuser2');
          });
      });
    });

    describe('GET /api/users/:id/tasks', () => {
      beforeEach(async () => {
        // Create public task for second user
        await request(app.getHttpServer())
          .post('/api/tasks')
          .set('Authorization', `Bearer ${secondUserToken}`)
          .send({
            title: 'Public Task',
            priority: 'medium',
            isPublic: true,
          });
      });

      it('should get public tasks of a user', () => {
        return request(app.getHttpServer())
          .get(`/api/users/${secondUserId}/tasks`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('meta');
            expect(Array.isArray(res.body.data)).toBe(true);
          });
      });
    });

    describe('GET /api/users/profile/me', () => {
      it('should get current user profile', () => {
        return request(app.getHttpServer())
          .get('/api/users/profile/me')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', userId);
            expect(res.body).toHaveProperty('email', 'test@example.com');
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .get('/api/users/profile/me')
          .expect(401);
      });
    });

    describe('PUT /api/users/profile/me', () => {
      it('should update user profile', () => {
        return request(app.getHttpServer())
          .put('/api/users/profile/me')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            fullName: 'Updated Name',
            email: 'test@example.com',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('fullName', 'Updated Name');
          });
      });
    });
  });

  describe('Complete User Flow (E2E)', () => {
    it('should complete full user journey: register → login → create category → create task → upload file → get tasks → update task → delete task', async () => {
      // Step 1: Register
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'journey@example.com',
          username: 'journeyuser',
          password: 'password123',
          fullName: 'Journey User',
        })
        .expect(201);

      expect(registerRes.body).toHaveProperty('message');
      expect(registerRes.body.message).toContain('berhasil');

      // Step 2: Login
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'journey@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(loginRes.body).toHaveProperty('accessToken');
      const token = loginRes.body.accessToken;
      const user = loginRes.body.user;

      // Step 3: Create Category
      const categoryRes = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Personal',
          color: '#FF5733',
        })
        .expect(201);

      expect(categoryRes.body).toHaveProperty('name', 'Personal');
      const category = categoryRes.body;

      // Step 4: Create Task
      const taskRes = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Task',
          description: 'Complete the journey',
          priority: 'high',
          categoryId: category.id,
          isPublic: false,
        })
        .expect(201);

      expect(taskRes.body).toHaveProperty('title', 'My First Task');
      const task = taskRes.body;

      // Step 5: Get All Tasks
      const tasksRes = await request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(tasksRes.body.data).toHaveLength(1);
      expect(tasksRes.body.data[0].id).toBe(task.id);

      // Step 6: Update Task
      const updateRes = await request(app.getHttpServer())
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task Title',
          priority: 'medium',
        })
        .expect(200);

      expect(updateRes.body).toHaveProperty('title', 'Updated Task Title');
      expect(updateRes.body).toHaveProperty('priority', 'medium');

      // Step 7: Toggle Task Completion
      const toggleRes = await request(app.getHttpServer())
        .patch(`/api/tasks/${task.id}/toggle`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(toggleRes.body).toHaveProperty('completed', true);

      // Step 8: Delete Task
      await request(app.getHttpServer())
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Step 9: Verify Deletion
      const finalTasksRes = await request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalTasksRes.body.data).toHaveLength(0);
    });
  });
});
