const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const database = await sqliteConnection();

    if (!name || !email || !password) {
      throw new AppError("Por favor, preencha todas as informações");
    }

    const user = await database.get("SELECT * FROM users WHERE email = ?", [ email ]);
    if (user) {
      throw new AppError("Este e-mail já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name, email, hashedPassword
    ])
    
    return res.json("Usuário cadastrado com sucesso");
  }

  async update(req, res) {
    const { name, email, new_password, current_password } = req.body;
    const { id } = req.params;
    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = ?", [ id ]);
    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const checkEmail = await database.get("SELECT * FROM users WHERE email = ?", [ email ]);
    if (checkEmail && checkEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name && user.name;
    user.email = email && user.email;

    
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
      user.name, user.email, user.password, id
    ])

    return res.json("As informações foram alteradas com sucesso.")
  }

  delete(req, res) {
    return res.json("Delete");
  }
}

module.exports = UserController;