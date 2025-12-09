class UpdateUserDto {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static validate(data) {
    const errors = [];

    if (data.username && data.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.password && data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }
}

module.exports = { UpdateUserDto };