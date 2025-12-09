class CreateProductDto {
  constructor(name, description, price, stock) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }

  static validate(data) {
    const errors = [];

    if (!data.name) {
      errors.push('Product name is required');
    }

    if (!data.description) {
      errors.push('Description is required');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (data.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (data.stock !== undefined && data.stock < 0) {
      errors.push('Stock must be a positive number');
    }

    return errors;
  }
}

module.exports = { CreateProductDto };