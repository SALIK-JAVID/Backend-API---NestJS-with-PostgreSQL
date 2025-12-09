const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { ProductsService } = require('./products.service');
const { ProductsController } = require('./products.controller');
const { Product } = require('./entities/product.entity');

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
class ProductsModule {}

module.exports = { ProductsModule }; 