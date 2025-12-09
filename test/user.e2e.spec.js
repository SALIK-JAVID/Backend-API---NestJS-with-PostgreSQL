const { Test } = require('@nestjs/testing');
const { INestApplication } = require('@nestjs/common');
const request = require('supertest');
const { AppModule } = require('../src/app.module');

describe('UsersController (e2e)', () => {
  let app;
  let token;
  let userId;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get token
    const user = {
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(user);

    token = registerResponse.body.access_token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/users (GET)', () => {
    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should not get users without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401); // Unauthorized
    });
  });

  describe('/api/users/:id (GET)', () => {
    it('should get a user by id', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body).toHaveProperty('username');
          expect(res.body).toHaveProperty('email');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/api/users (POST)', () => {
    it('should create a new user', () => {
      const newUser = {
        username: 'newuser123',
        email: 'newuser@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe(newUser.username);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should validate user data', () => {
      const invalidUser = {
        username: 'ab', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      };

      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUser)
        .expect(400); // Bad Request
    });
  });

  describe('/api/users/:id (PATCH)', () => {
    it('should update a user', () => {
      const updateData = {
        username: 'updatedusername',
      };

      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toBe(updateData.username);
        });
    });
  });

  describe('/api/users/:id (DELETE)', () => {
    let deleteUserId;

    beforeAll(async () => {
      const newUser = {
        username: 'deleteuser',
        email: 'delete@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser);

      deleteUserId = response.body.id;
    });

    it('should delete a user', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${deleteUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 404 when deleting non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

module.exports = {};