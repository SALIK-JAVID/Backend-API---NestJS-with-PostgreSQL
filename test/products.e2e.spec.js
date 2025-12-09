const { Test } = require('@nestjs/testing');
const { INestApplication } = require('@nestjs/common');
const request = require('supertest');
const { AppModule } = require('../src/app.module');

describe('ProductsController (e2e)', () => {
  let app;
  let token;
  let productId;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get token
    const user = {
      username: 'productuser',
      email: 'product@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(user);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    token = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/products (POST)', () => {
    it('should create a new product', () => {
      const newProduct = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        stock: 10,
      };

      return request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(newProduct.name);
          expect(res.body.price).toBe(String(newProduct.price));
          productId = res.body.id;
        });
    });

    it('should not create product without authentication', () => {
      const newProduct = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
      };

      return request(app.getHttpServer())
        .post('/api/products')
        .send(newProduct)
        .expect(401); // Unauthorized
    });

    it('should validate product data', () => {
      const invalidProduct = {
        name: '',
        description: '',
        price: -10, // Negative price
      };

      return request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidProduct)
        .expect(400); // Bad Request
    });
  });

  describe('/api/products (GET)', () => {
    it('should get all products', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/api/products/:id (GET)', () => {
    it('should get a product by id', () => {
      return request(app.getHttpServer())
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(productId);
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should return 404 for non-existent product', () => {
      return request(app.getHttpServer())
        .get('/api/products/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/api/products/:id (PATCH)', () => {
    it('should update a product', () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 149.99,
      };

      return request(app.getHttpServer())
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
        });
    });
  });

  describe('/api/products/:id (DELETE)', () => {
    it('should delete a product', () => {
      return request(app.getHttpServer())
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 404 when deleting non-existent product', () => {
      return request(app.getHttpServer())
        .delete('/api/products/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

module.exports = {};