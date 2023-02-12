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

  async show(req, res) {
    const { id } = req.params;

    const movie = await knex("movie_notes").where({ id }).first();

    return res.json(movie);
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movie_notes").where({ id }).first().delete();

    return res.json("A nota foi excluída com sucesso.")
  }

  async showAll(req, res) {
    const { user_id } = req.query;

    const notes = await knex("movie_notes").where({ user_id });

    return res.json(notes)
  }
}

module.exports = NotesController;