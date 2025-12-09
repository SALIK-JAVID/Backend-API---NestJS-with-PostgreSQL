const { Injectable, NotFoundException } = require('@nestjs/common');
const { InjectRepository } = require('@nestjs/typeorm');
const { Product } = require('./entities/product.entity');

@Injectable()
class ProductsService {
  constructor(@InjectRepository(Product) productsRepository) {
    this.productsRepository = productsRepository;
  }

  async create(createProductDto, userId) {
    const product = this.productsRepository.create({
      ...createProductDto,
      userId: userId,
    });

    return await this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByUserId(userId) {
    return await this.productsRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id, updateProductDto, userId) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.userId !== userId) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id, userId) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.userId !== userId) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productsRepository.remove(product);
    return { message: `Product with ID ${id} has been deleted` };
  }
}

module.exports = { ProductsService };