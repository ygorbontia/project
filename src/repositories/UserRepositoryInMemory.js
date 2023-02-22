class UserRepositoryInMemory {
  users = [];

  async findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async create({ name, email, password }) {
    const user = {
      id: Math.round(Math.random() * 1000),
      name,
      email,
      password
    }

    this.users.push(user);

    return user;
  }
}

module.exports = UserRepositoryInMemory;