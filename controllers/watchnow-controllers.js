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

const getNumLikeInSession = async (req, res) => {
    const session_id = req.session.session_id;
    const result = await pool.query(queries.getNumLikeInSession, [session_id]);
    res.send(JSON.stringify(result.rows[0]));//Invia un json con una proprietà "n_likes" che indica il numero di like nella sessione
};

const getLikeMovies = async (req, res) => {
    const session_id = req.session.session_id;
    const result = await pool.query(queries.getLikeMoviesInSession, [session_id]);
    res.send(JSON.stringify(result.rows));//Invia un array di json con i film piaciuti nella sessione
};

module.exports = {
    getNumLikeInSession,
    getLikeMovies,
};