const { Test } = require('@nestjs/testing');
const request = require('supertest');
const { AppModule } = require('../src/app.module');

describe('API E2E Tests', () => {
  let app;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    let authToken;
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
    };

    it('should register a new user (POST /api/auth/register)', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      authToken = response.body.access_token;
    });

    it('should not register user with duplicate email (POST /api/auth/register)', async () => {
      await request(httpServer)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('should login with valid credentials (POST /api/auth/login)', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with invalid credentials (POST /api/auth/login)', async () => {
      await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should get user profile with valid token (GET /api/auth/profile)', async () => {
      const response = await request(httpServer)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not get profile without token (GET /api/auth/profile)', async () => {
      await request(httpServer)
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('Products', () => {
    let authToken;
    let productId;
    const testUser = {
      username: 'productuser' + Date.now(),
      email: 'product' + Date.now() + '@example.com',
      password: 'password123',
    };

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send(testUser);
      authToken = response.body.access_token;
    });

    it('should create a product (POST /api/products)', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'A test product description',
        price: 99.99,
        stock: 10,
      };

      const response = await request(httpServer)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProduct.name);
      productId = response.body.id;
    });

    it('should not create product without auth (POST /api/products)', async () => {
      await request(httpServer)
        .post('/api/products')
        .send({
          name: 'Test',
          description: 'Test',
          price: 10,
        })
        .expect(401);
    });

    it('should get all products (GET /api/products)', async () => {
      const response = await request(httpServer)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a single product (GET /api/products/:id)', async () => {
      const response = await request(httpServer)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
    });

    it('should update a product (PATCH /api/products/:id)', async () => {
      const updateData = {
        price: 149.99,
        stock: 20,
      };

      const response = await request(httpServer)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.price).toBe(String(updateData.price));
    });

    it('should delete a product (DELETE /api/products/:id)', async () => {
      await request(httpServer)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 for deleted product (GET /api/products/:id)', async () => {
      await request(httpServer)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Users', () => {
    let authToken;
    let userId;
    const adminUser = {
      username: 'adminuser' + Date.now(),
      email: 'admin' + Date.now() + '@example.com',
      password: 'password123',
    };

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send(adminUser);
      authToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('should get all users (GET /api/users)', async () => {
      const response = await request(httpServer)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a single user (GET /api/users/:id)', async () => {
      const response = await request(httpServer)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(adminUser.email);
    });

    it('should not get users without auth (GET /api/users)', async () => {
      await request(httpServer)
        .get('/api/users')
        .expect(401);
    });
  });
});

module.exports = {};