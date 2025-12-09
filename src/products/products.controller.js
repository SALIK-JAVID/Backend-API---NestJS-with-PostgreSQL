const { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, Inject } = require('@nestjs/common');
const { ProductsService } = require('./products.service');
const { CreateProductDto } = require('./dto/create-product.dto');
const { UpdateProductDto } = require('./dto/update-product.dto');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');

@Controller('products')
@UseGuards(JwtAuthGuard)
class ProductsController {
  constructor(@Inject(ProductsService) productsService) {
    this.productsService = productsService;
  }

  @Post()
  async create(@Body() body, @Request() req) {
    const errors = CreateProductDto.validate(body);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.productsService.create(body, req.user.id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('my')
  findMy(@Request() req) {
    return this.productsService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.productsService.findOne(parseInt(id));
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() body, @Request() req) {
    const errors = UpdateProductDto.validate(body);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.productsService.update(parseInt(id), body, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id, @Request() req) {
    return this.productsService.remove(parseInt(id), req.user.id);
  }
}

module.exports = { ProductsController };