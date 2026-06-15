import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TestDataFactory } from './factories/test-data.factory';
import { TestAssertions } from './helpers/test-helpers';
import { Role } from '../src/common/enums/role.enum';

/**
 * Test de integración completo del flujo de autenticación y operaciones CRUD
 * Este test prueba end-to-end los flujos principales de la aplicación
 */
describe('End-to-End Integration Tests', () => {
  let app: INestApplication;
  let testData = TestDataFactory;

  beforeAll(async () => {
    // Nota: Para ejecutar estos tests en un ambiente real, necesitarías:
    // 1. Una base de datos de test configurada
    // 2. Las migraciones de TypeORM ejecutadas
    // 3. Variables de entorno de test configuradas

    // Por ahora, este es un template que muestra la estructura

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: process.env.DB_HOST,
        //   port: parseInt(process.env.DB_PORT),
        //   username: process.env.DB_USERNAME,
        //   password: process.env.DB_PASSWORD,
        //   database: process.env.DB_NAME,
        //   autoLoadEntities: true,
        //   synchronize: true,
        //   dropSchema: true,
        // }),
        // AppModule, // Importar el módulo principal
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    let authToken: string;
    let userId: string;

    it('should register a new student', async () => {
      const registerDto = {
        email: 'newstudent@test.com',
        password: 'securePassword123!',
        firstName: 'Test',
        lastName: 'Student',
        documentNumber: '1234567890',
        universityId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register-student')
        .send(registerDto)
        .expect(201);

      TestAssertions.expectAuthResponse(response.body);
      authToken = response.body.token;
      userId = response.body.user.id;

      expect(response.body.student).toBeDefined();
      expect(response.body.student.documentNumber).toBe(registerDto.documentNumber);
    });

    it('should login with registered credentials', async () => {
      const loginDto = {
        email: 'newstudent@test.com',
        password: 'securePassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      TestAssertions.expectAuthResponse(response.body);
      expect(response.body.token).toBeTruthy();
    });

    it('should not login with incorrect password', async () => {
      const loginDto = {
        email: 'newstudent@test.com',
        password: 'wrongPassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('User Management Flow', () => {
    let userId: string;

    it('should get user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/123e4567-e89b-12d3-a456-426614174000')
        .expect(200);

      TestAssertions.expectUserResponse(response.body);
    });

    it('should update user information', async () => {
      const updateDto = {
        email: 'updatedemail@test.com',
      };

      const response = await request(app.getHttpServer())
        .patch('/user/123e4567-e89b-12d3-a456-426614174000')
        .send(updateDto)
        .expect(200);

      expect(response.body.email).toBe(updateDto.email);
    });

    it('should list users with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .query({ page: 1, limit: 10 })
        .expect(200);

      TestAssertions.expectPaginatedResponse(response.body);
    });
  });

  describe('Student Management Flow', () => {
    it('should get all students', async () => {
      const response = await request(app.getHttpServer())
        .get('/student')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get student by id', async () => {
      const response = await request(app.getHttpServer())
        .get('/student/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
    });

    it('should assign skills to student', async () => {
      const assignSkillsDto = {
        skillIds: [1, 2, 3],
      };

      const response = await request(app.getHttpServer())
        .post('/student/1/skills')
        .send(assignSkillsDto)
        .expect(201);

      expect(response.body).toHaveProperty('skills');
      expect(Array.isArray(response.body.skills)).toBe(true);
    });

    it('should remove skill from student', async () => {
      const response = await request(app.getHttpServer())
        .delete('/student/1/skills/1')
        .expect(200);

      expect(response.body).toHaveProperty('skills');
    });
  });

  describe('Vacancy and Application Flow', () => {
    it('should list vacancies', async () => {
      const response = await request(app.getHttpServer())
        .get('/vacancie')
        .expect(200);

      expect(response.body).toHaveProperty('data');
    });

    it('should get vacancy details', async () => {
      const response = await request(app.getHttpServer())
        .get('/vacancie/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('company');
    });

    it('should create an application', async () => {
      const createApplicationDto = {
        studentId: 1,
        vacancyId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/application')
        .send(createApplicationDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('pending');
    });

    it('should update application status', async () => {
      const updateApplicationDto = {
        status: 'accepted',
      };

      const response = await request(app.getHttpServer())
        .patch('/application/1')
        .send(updateApplicationDto)
        .expect(200);

      expect(response.body.status).toBe('accepted');
    });
  });

  describe('Internship Flow', () => {
    it('should list internships', async () => {
      const response = await request(app.getHttpServer())
        .get('/internship')
        .expect(200);

      expect(response.body).toHaveProperty('data');
    });

    it('should create internship', async () => {
      const createInternshipDto = {
        studentId: 1,
        companyId: 1,
        title: 'Summer Internship',
        description: 'Software engineering internship',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/internship')
        .send(createInternshipDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('active');
    });

    it('should update internship', async () => {
      const updateInternshipDto = {
        status: 'completed',
      };

      const response = await request(app.getHttpServer())
        .patch('/internship/1')
        .send(updateInternshipDto)
        .expect(200);

      expect(response.body.status).toBe('completed');
    });
  });

  describe('Error Handling and Validation', () => {
    it('should return 400 for invalid email format', async () => {
      const loginDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });

    it('should return 404 for non-existent resource', async () => {
      await request(app.getHttpServer())
        .get('/student/99999')
        .expect(404);
    });

    it('should return 409 for duplicate email registration', async () => {
      const registerDto = {
        email: 'duplicate@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        documentNumber: 'DOC123',
        universityId: 1,
      };

      // First registration
      await request(app.getHttpServer())
        .post('/auth/register-student')
        .send(registerDto)
        .expect(201);

      // Attempt duplicate
      await request(app.getHttpServer())
        .post('/auth/register-student')
        .send(registerDto)
        .expect(409);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteDto = {
        email: 'test@example.com',
        // Missing password
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(incompleteDto)
        .expect(400);
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow student to access their profile', async () => {
      // Este test requeriría un token válido
      // const response = await request(app.getHttpServer())
      //   .get('/student/profile')
      //   .set('Authorization', `Bearer ${studentToken}`)
      //   .expect(200);
    });

    it('should prevent student from accessing admin endpoints', async () => {
      // Este test requeriría un token de estudiante
      // const response = await request(app.getHttpServer())
      //   .post('/user')
      //   .set('Authorization', `Bearer ${studentToken}`)
      //   .send({ email: 'test@example.com', password: 'pass' })
      //   .expect(403);
    });

    it('should allow admin to manage users', async () => {
      // Este test requeriría un token de admin
      // const response = await request(app.getHttpServer())
      //   .get('/user')
      //   .set('Authorization', `Bearer ${adminToken}`)
      //   .expect(200);
    });
  });
});
