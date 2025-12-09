# Backend API - NestJS with PostgreSQL

A RESTful API built with NestJS, PostgreSQL, TypeORM, and JWT authentication.

## 🚀 Features

- ✅ User authentication with JWT
- ✅ CRUD operations for Users and Products
- ✅ Input validation using class-validator
- ✅ Error handling
- ✅ PostgreSQL database with TypeORM
- ✅ Unit and E2E tests
- ✅ Password hashing with bcrypt
- ✅ Protected routes with JWT guards

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd backend-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestjs_backend

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=1d

PORT=3000
NODE_ENV=development
```

4. **Create PostgreSQL database:**

```bash
psql -U postgres
CREATE DATABASE nestjs_backend;
\q
```

5. **Run the application:**

```bash
npm run start:dev
```

The server will start on `http://localhost:3000/api`

## 📚 API Endpoints

### Authentication

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register new user        | No            |
| POST   | `/api/auth/login`    | Login user               | No            |
| GET    | `/api/auth/profile`  | Get current user profile | Yes           |

### Users

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/api/users`     | Get all users   | Yes           |
| GET    | `/api/users/:id` | Get user by ID  | Yes           |
| POST   | `/api/users`     | Create new user | Yes           |
| PATCH  | `/api/users/:id` | Update user     | Yes           |
| DELETE | `/api/users/:id` | Delete user     | Yes           |

### Products

| Method | Endpoint            | Description                 | Auth Required |
| ------ | ------------------- | --------------------------- | ------------- |
| GET    | `/api/products`     | Get all products            | Yes           |
| GET    | `/api/products/my`  | Get current user's products | Yes           |
| GET    | `/api/products/:id` | Get product by ID           | Yes           |
| POST   | `/api/products`     | Create new product          | Yes           |
| PATCH  | `/api/products/:id` | Update product              | Yes           |
| DELETE | `/api/products/:id` | Delete product              | Yes           |

## 🧪 Example Requests

### 1. Register a User

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create a Product (Protected)

```bash
POST http://localhost:3000/api/products
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Gaming laptop with RTX 4090",
  "price": 2999.99,
  "stock": 5
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Gaming laptop with RTX 4090",
  "price": "2999.99",
  "stock": 5,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get All Products (Protected)

```bash
GET http://localhost:3000/api/products
Authorization: Bearer <your_token>
```

### 5. Update a Product (Protected)

```bash
PATCH http://localhost:3000/api/products/1
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "price": 2799.99,
  "stock": 10
}
```

### 6. Delete a Product (Protected)

```bash
DELETE http://localhost:3000/api/products/1
Authorization: Bearer <your_token>
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## 📁 Project Structure

```
backend-api/
├── src/
│   ├── main.js                 # Application entry point
│   ├── app.module.js           # Root module
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── jwt.strategy.js
│   │   └── guards/
│   │       └── jwt-auth.guard.js
│   ├── users/                  # Users module
│   │   ├── users.module.js
│   │   ├── users.controller.js
│   │   ├── users.service.js
│   │   ├── dto/
│   │   │   ├── create-user.dto.js
│   │   │   └── update-user.dto.js
│   │   └── entities/
│   │       └── user.entity.js
│   ├── products/               # Products module
│   │   ├── products.module.js
│   │   ├── products.controller.js
│   │   ├── products.service.js
│   │   ├── dto/
│   │   │   ├── create-product.dto.js
│   │   │   └── update-product.dto.js
│   │   └── entities/
│   │       └── product.entity.js
│   └── common/                 # Common utilities
│       └── filters/
│           └── http-exception.filter.js
├── test/                       # Tests
│   ├── auth.e2e.spec.js
│   ├── users.e2e.spec.js
│   └── products.e2e.spec.js
├── .env
├── .gitignore
├── package.json
├── jest.config.js
└── README.md
```

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **Protected Routes**: Only authenticated users can access certain endpoints
4. **Input Validation**: All inputs are validated using class-validator
5. **Error Handling**: Comprehensive error handling and logging

## 🛡️ Database Schema

### Users Table

```sql
id: integer (primary key)
username: varchar (unique)
email: varchar (unique)
password: varchar (hashed)
createdAt: timestamp
updatedAt: timestamp
```

### Products Table

```sql
id: integer (primary key)
name: varchar
description: text
price: decimal(10,2)
stock: integer
userId: integer (foreign key)
createdAt: timestamp
updatedAt: timestamp
```

## 📝 Notes

- TypeORM automatically creates database tables on first run
- Default admin credentials are not provided - register your first user
- JWT tokens expire after 1 day (configurable in .env)
- Password minimum length is 6 characters
- Username minimum length is 3 characters

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- NestJS Documentation
- TypeORM Documentation
- PostgreSQL Documentation
