var express = require("express");
const Joi = require("joi");
const movie = require("../controllers/movie");
const user = require("../controllers/user");
const verification = require("../middlewares/tokenVerification");
const roleVerification = require("../middlewares/roleVerification");

var router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

router.get("/signup", user.signUp);
router.get("/login", user.logIn);

router.get("/movies", verification.verifyToken, roleVerification.verifyRole("R"), movie.getMovies);

router.get(
  "/movies/:id",
  verification.verifyToken,
  roleVerification.verifyRole("R"),
  movie.getMovie
);

router.post(
  "/movies",
  verification.verifyToken,
  roleVerification.verifyRole("W"),
  movie.createMovie
);

router.put(
  "/movies/:id",
  verification.verifyToken,
  roleVerification.verifyRole("W"),
  movie.updateMovie
);

router.delete(
  "/movies/:id",
  verification.verifyToken,
  roleVerification.verifyRole("W"),
  movie.deleteMovie
);

module.exports = router;
