const { Test } = require('@nestjs/testing');
const { INestApplication } = require('@nestjs/common');
const request = require('supertest');
const { AppModule } = require('../src/app.module');

describe('AuthController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(newUser.email);
        });
    });

    it('should not register user with existing email', () => {
      const duplicateUser = {
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409); // Conflict
    });

    it('should validate input data', () => {
      const invalidUser = {
        username: 'ab', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400); // Bad Request
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(credentials)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should not login with invalid credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(credentials)
        .expect(401); // Unauthorized
    });
  });

  describe('/api/auth/profile (GET)', () => {
    let token;

    beforeAll(async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(credentials);

      token = response.body.access_token;
    });

    it('should get profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should not get profile without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401); // Unauthorized
    });
  });
});

module.exports = {};