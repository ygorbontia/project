const knex = require("../database/knex");

class NotesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const movie_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    })

    if (tags) {
      const tagsList = tags.map(name => {
        return {
          movie_id,
          user_id,
          name
        }
      })

      await knex("movie_tags").insert(tagsList);
    }

    return res.status(201).json("Nota cadastrada com sucesso.");
  }

  show(req, res) {

  }

  delete(req, res) {

  }

  showAll(req, res) {

  }
}

module.exports = NotesController;