const sqliteConnection = require("../database/sqlite");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const database = await sqliteConnection();

    if (!name || !email || !password) {
      
    }
    
    return res.json("Create");
  }

  update(req, res) {
    return res.json("Update")
  }

  delete(req, res) {
    return res.json("Delete");
  }
}

module.exports = UserController;