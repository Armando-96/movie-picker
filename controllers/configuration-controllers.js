const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const axios = require("axios");
const { TMDB_API_KEY, CONFIGURATION } = require("./../model/global-variables.js");
const Movie = require("./../model/movie.js");

const insertGenres = async function insertGenres() {
    const exist = (await pool.query(queries.checkGenres)).rows.length;
    if (!exist) {
        const genres = (await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)).data.genres;
        for (let i = 0; i < genres.length; i++) {
            await pool.query(queries.insertGenre, [genres[i].id, genres[i].name]);
        }
    }
}

module.exports = {
    insertGenres,
};