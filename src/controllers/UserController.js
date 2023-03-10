const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const DiskStorage = require("../providers/DiskStorage");

const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      throw new AppError("Por favor, preencha todas as informações");
    }
    
    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);
    await userCreateService.execute({ name, email, password });
    
    return res.json("Usuário cadastrado com sucesso");
  }

  async update(req, res) {
    const { name, email, new_password, current_password } = req.body;
    const user_id = req.user.id;
    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = ?", [ user_id ]);
    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const checkEmail = await database.get("SELECT * FROM users WHERE email = ?", [ email ]);
    if (checkEmail && checkEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    
    if (new_password && !current_password) {
      throw new AppError("Por favor, insira a senha atual.");
    }

    
    if (new_password && current_password) {
      const checkPassword = await compare(current_password, user.password);
      if (!checkPassword) {
        throw new AppError("A senha atual não confere.")
      }
      
      user.password = await hash(new_password, 8);
    }

    await database.run("UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?", [
      user.name, user.email, user.password, user_id
    ])

    return res.json("As informações foram alteradas com sucesso.")
  }

  async delete(req, res) {
    const user_id = req.user.id;
    const database = await sqliteConnection();
    const diskStorage = new DiskStorage();

    const user = await database.get("SELECT * FROM users WHERE id = ?", [ user_id ]);
    diskStorage.deleteFile(user.avatar);

    await database.run("DELETE FROM users WHERE id = ?", [ user_id ]);

    return res.json("Usuário excluído com sucesso.");
  }
}

module.exports = UserController;