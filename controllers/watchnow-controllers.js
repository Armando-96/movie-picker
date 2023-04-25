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
const Movie = require("./../model/movie.js");
const path = require("path");

const movieTest = new Movie({
  id: 238,
  title: "The Godfather",
  overview:
    "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
  poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  genres: [18, 80],
  rating: 8.7,
});

const initial = async (req, res) => {
  CONFIGURATION.then((config) => {
    res.render("watchnow-initial", { movie: movieTest, config: config });
  });
};

const getNumLikeInSession = async (req, res) => {
  const id_session = req.cookies.id_session;
  const result = await pool.query(queries.getNumLikeInSession, [id_session]);
  res.send(JSON.stringify(result.rows[0])); //Invia un json con una proprietà "n_likes" che indica il numero di like nella sessione
};

const getLikeMovies = async (req, res) => {
  const id_session = req.cookies.id_session;
  const result = await pool.query(queries.getLikeMovies, [id_session]);
  res.send(JSON.stringify(result.rows)); //Invia un array di json con i film piaciuti nella sessione
};

module.exports = {
  initial,
  getNumLikeInSession,
  getLikeMovies,
};
