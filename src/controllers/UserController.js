class UserController {
  create(req, res) {
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