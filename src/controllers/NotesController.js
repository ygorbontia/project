const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const user_id = req.user.id;

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
    const user_id = req.user.id;

    const movie = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ movie_id: id });
    
    if (!movie) {
      throw new AppError("Você não tem permissão para acessar essa nota", 401);
    }

    if (movie.user_id !== user_id) {
      throw new AppError("Você não tem permissão para acessar essa nota", 401);
    }

    return res.json({
      ...movie,
      tags
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const user_id = req.user.id;

    const movie = await knex("movie_notes").where({ id }).first();
    if (!movie) {
      throw new AppError("Você não tem permissão para excluir essa nota", 401);
    }
    
    if (movie.user_id !== user_id) {
      throw new AppError("Você não tem permissão para excluir essa nota", 401);
    }

    await knex("movie_notes").where({ id }).first().delete();

    return res.json("A nota foi excluída com sucesso.")
  }

  async showAll(req, res) {
    const { title } = req.query;
    const user_id = req.user.id;
    let notes;

    const tags = await knex("movie_tags").where({ user_id })

    if (title) {
      notes = await knex("movie_notes").where({ user_id }).whereLike("title", `%${ title }%`).orderBy("title");
    } else {
      notes = await knex("movie_notes").where({ user_id }).orderBy("created_at", "desc");
    }

    const movieTags = notes.map(note => {
      const filteredTags = tags.filter(tag => tag.movie_id === note.id)

      return {
        ...note,
        tags: filteredTags
      }
    })

    return res.json({ notes: movieTags })
  }
}

module.exports = NotesController;