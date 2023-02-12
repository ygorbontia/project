const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(req, res) {
    const id = req.user.id;
    const diskStorage = new DiskStorage();
    const file = req.file.filename;
    
    const user = await knex("users").where({ id }).first();
    if (!user) {
      throw new AppError("Somente usuários autenticados podem alterar o avatar", 401);
    }
    
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }
    
    const filename = await diskStorage.saveFile(file);
    user.avatar = filename;
    
    await knex("users").update(user).where({ id });
    
    return res.json("A imagem de avatar foi alterada com sucesso.")
  }
}

module.exports = UserAvatarController;