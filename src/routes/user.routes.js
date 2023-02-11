const { Router } = require("express");
const userRoutes = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

userRoutes.post("/", userController.create);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.delete);

module.exports = userRoutes;