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

/*
const movieTest = {
  id: 238,
  title: "The Godfather",
  overview:
    "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
  poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  genres: [18, 80],
  rating: "8.7",
};
*/

const initial = async (req, res) => {
  try {
    const user_id = Number(req.session.user_id);
    const session_id = req.session.session_id;
    let movie_json = await sessionController.getMovieFunction(user_id);
    const firstMovie = new Movie(movie_json);
    movie_json = await sessionController.getMovieFunction(user_id);
    const secondMovie = new Movie(movie_json);
    CONFIGURATION.then((config) => {
      res.render("watchnow-initial", {
        movies: [firstMovie, secondMovie],
        config: config,
        session_id: session_id,
        mod: "whatchnow",
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

const tournament = async (req, res) => {
  try {
    const user_id = Number(req.session.user_id);
    const session_id = req.session.session_id;
    CONFIGURATION.then((config) => {
      res.render("watchnow-tournament", {
        config: config,
        session_id: session_id,
        mod: "whatchnow",
        movie: {},
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante l'inizializzazione del torneo" });
  }
};

const final = async (req, res) => {
  try {
    const session_id = req.session.session_id;
    const movie = req.query.movie;
    CONFIGURATION.then((config) => {
      res.render("watchnow-final", {
        config: config,
        session_id: session_id,
        mod: "whatchnow",
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

const getNumLikeInSession = async (req, res) => {
  const session_id = req.session.session_id;
  const result = await pool.query(queries.getNumLikeInSession, [session_id]);
  res.send(JSON.stringify(result.rows[0])); //Invia un json con una proprietà "n_likes" che indica il numero di like nella sessione
};

const getLikeMovies = async (req, res) => {
  try {
    const session_id = req.session.session_id;
    const result = await pool.query(queries.getLikeMoviesInSession, [
      session_id,
    ]);
    res.send(JSON.stringify(result.rows)); //Invia un array di json con i film piaciuti nella sessione
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante la richiesta dei film piaciuti" });
  }
};

module.exports = {
  initial,
  tournament,
  final,
  getNumLikeInSession,
  getLikeMovies,
};
