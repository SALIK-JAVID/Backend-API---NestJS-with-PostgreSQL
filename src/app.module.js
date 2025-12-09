const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { AuthModule } = require('./auth/auth.module');
const { UsersModule } = require('./users/users.module');
const { ProductsModule } = require('./products/products.module');
const { User } = require('./users/entities/user.entity');
const { Product } = require('./products/entities/product.entity');

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configure TypeORM with PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Product], // Register all entities
      synchronize: true, // Auto-create tables (disable in production!)
      logging: false,
    }),

    // Import feature modules
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
class AppModule {}

module.exports = { AppModule };
