const { Router } = require("express");
const userRoutes = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

const ensureAuthentication = require("../middlewares/ensureAuthentication");

userRoutes.post("/", userController.create);
userRoutes.put("/", ensureAuthentication, userController.update);
userRoutes.delete("/", ensureAuthentication, userController.delete);

module.exports = userRoutes;