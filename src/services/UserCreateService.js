const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new AppError("Este e-mail já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    await this.userRepository.create({ name, email, password: hashedPassword });
  }
}

module.exports = UserCreateService;