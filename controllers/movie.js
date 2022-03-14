const Joi = require("joi");
const prisma = require("../lib/prismaClient");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

async function getMovies(req, res) {
  try {
    await prisma.$connect();

    const movies = await prisma.movies.findMany();

    return res.status(200).json({
      movies,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function getMovie(req, res) {
  try {
    const { id } = req.params;

    if (id === "" || id === null || id === undefined) {
      return res.status(400).json({
        error: "No id",
      });
    }

    await prisma.$connect();

    const movie = await prisma.movies.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (movie === null) {
      return res.status(400).json({
        error: "No moviw with that id",
      });
    }

    return res.status(200).json({
      movie,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function createMovie(req, res) {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.response(400).json({
        error: "Schema falla",
      });
    }

    await prisma.$connect();

    const movie = {
      name: req.body.name,
    };

    const movieCreated = await prisma.movies.create({
      data: movie,
    });
    console.log(movieCreated);

    return res.status(200).json({
      movieCreated,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function updateMovie(req, res) {
  try {
    let { id } = req.params;
    const { name } = req.body;

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Schema falla",
      });
    }

    if (id === "" || id === null || id === undefined) {
      return res.status(400).json({
        error: "No id",
      });
    }

    id = parseInt(id);

    const updatedMovie = await prisma.movies.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return res.status(200).json({
      updatedMovie,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteMovie(req, res) {
  try {
    let { id } = req.params;

    if (id === "" || id === null || id === undefined) {
      return res.status(400).json({
        error: "No id",
      });
    }

    id = parseInt(id);

    await prisma.$connect();

    const deletedMovie = await prisma.movies.delete({
      where: {
        id: id,
      },
    });

    return res.status(204).json({
      deletedMovie,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

const movie = { getMovies, getMovie, createMovie, updateMovie, deleteMovie };

module.exports = movie;
