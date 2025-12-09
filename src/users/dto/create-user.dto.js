// DTOs in plain JavaScript - validation will be handled manually
class CreateUserDto {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static validate(data) {
    const errors = [];

    if (!data.username) {
      errors.push('Username is required');
    } else if (data.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!data.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.password) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }
}

module.exports = { CreateUserDto };