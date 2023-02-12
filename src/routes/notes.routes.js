const { Router } = require("express");
const notesRoutes = Router();

const NotesController = require("../controllers/NotesController");
const notesController = new NotesController();

notesRoutes.post("/:user_id", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/", notesController.showAll);

module.exports = notesRoutes;