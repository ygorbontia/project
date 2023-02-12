const { Router } = require("express");
const userRoutes = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

const UserAvatarController = require("../controllers/UserAvatarController");
const userAvatarController = new UserAvatarController();

const multer = require("multer");
const multerConfig = require("../configs/upload");
const upload = multer(multerConfig.MULTER);

const ensureAuthentication = require("../middlewares/ensureAuthentication");

userRoutes.post("/", userController.create);
userRoutes.put("/", ensureAuthentication, userController.update);
userRoutes.delete("/", ensureAuthentication, userController.delete);

userRoutes.patch("/avatar", ensureAuthentication, upload.single("avatar"), userAvatarController.update);

module.exports = userRoutes;