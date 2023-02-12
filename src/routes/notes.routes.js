const { Router } = require("express");
const notesRoutes = Router();

const NotesController = require("../controllers/NotesController");
const notesController = new NotesController();

const ensureAuthentication = require("../middlewares/ensureAuthentication");
notesRoutes.use(ensureAuthentication);

notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/", notesController.showAll);

module.exports = notesRoutes;