const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const axios = require("axios");
const {
  TMDB_API_KEY,
  CONFIGURATION,
  THRESHOLD_FOR_FILTERING,
  TOTAL_PAGES_DISCOVER,
  TOTAL_PAGES_TRENDING,
} = require("./../model/global-variables.js");
const sessionController = require("./session-controllers.js");
const Movie = require("./../model/movie.js");
const path = require("path");
const session = require("express-session");

const initial = async (req, res) => {
  try {
    const user_id = Number(req.session.user_id);
    const session_id = req.session.session_id;
    const movie_json = await sessionController.getMovieFunction(user_id);
    const firstMovie = new Movie(movie_json);
    CONFIGURATION.then((config) => {
      res.render("discovery-initial", {
        movie: firstMovie,
        config: config,
        session_id: session_id,
        mod: "discovery",
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante la richiesta film randomico" });
  }
};

const final = async (req, res) => {
  try {
    const session_id = req.session.session_id;
    const movie_id = req.query.movie;
    const movie = (await pool.query(queries.checkMovie, [movie_id])).rows[0];
    CONFIGURATION.then((config) => {
      res.render("discovery-final", {
        config: config,
        session_id: session_id,
        movie: movie,
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante il rendering del film finale" });
  }
};
module.exports = {
  initial,
  final,
};
