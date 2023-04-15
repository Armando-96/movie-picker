const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const axios = require("axios");
const { TMDB_API_KEY, CONFIGURATION } = require("./../model/global-variables.js");
const Movie = require("./../model/movie.js");

const getMaxIdSessions = async function getMaxIdSessions() {
    const result = await pool.query(queries.getMaxIdSessions);
    return result.rows[0].max;
};

const createSession = (id_session, id_user) => {
    pool.query(queries.createSession, [id_session, id_user]);
};


const initializeSession = async (user, res) => {
    const id_session = (await getMaxIdSessions()) + 1;
    createSession(id_session, user.user_id);
    //Inseriamo l'id della sessione nel cookie e altri dati di convenienza
    res.cookie("id_session", String(id_session));
    res.cookie("id_user", String(user.user_id));
    res.cookie("username", user.username);
    renderFirstMovie(user.username, id_session, res);
};

const endSession = async (req, res) => {
    //Eliminiamo i cookie
    res.clearCookie("id_session");
    res.clearCookie("id_user");
    res.clearCookie("username");
    res.send("Session ended pagina di buona visione");
}

const addInteraction = async (req, res) => {
    const { preference, id_movie } = req.query;
    const id_session = Number(req.cookies.id_session);
    const movie = (await axios.get(`https://api.themoviedb.org/3/movie/${id_movie}?api_key=${TMDB_API_KEY}&language=en-US`)).data;
    if (!(await checkFilm(id_movie, id_session))) {
        if (!(await checkMovie(id_movie))) {
            await insertMovie(movie);
        }
        pool.query(queries.createInteraction, [id_session, id_movie, preference]);
        pool.query(queries.incViews, [id_session]);
        if (preference === "like")
            pool.query(queries.incLikes, [id_session]);
    }

    let next = await getMovie();
    let duplicate = await checkFilm(next.id, id_session);
    let i = 0;
    while (duplicate) {
        i++;
        if (i > 50) break;
        next = await getMovie();
        duplicate = await checkFilm(next.id, id_session);
    }
    if (i <= 50)
        res.send(next);
    else
        res.send({ "nonext": true });//Non ci sono più film da mostrare
}

//Funzione che restituisce un film randomico in json
const getMovie = async () => {
    const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const movies = response.data.results;
    return movies[Math.ceil(Math.random() * movies.length - 1)];
};

const renderFirstMovie = async (username, id_session, res) => {
    try {
        const movie_json = await getMovie();
        const firstMovie = new Movie(movie_json);
        CONFIGURATION.then((config) => {
            res.render("partials/movie_card.pug", {
                movie: firstMovie,
                config: config,
                username: username,
                id_session: id_session,
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

const checkFilm = async (id_movie, id_session) => {
    const result = await pool.query(queries.checkFilm, [id_movie, id_session]);
    return result.rows.length;
};

const checkMovie = async (id_movie) => {
    const result = await pool.query(queries.checkMovie, [id_movie]);
    return result.rows.length;
};

const insertMovie = async (movie) => {
    await pool.query(queries.insertMovie, [movie.id, movie.title, movie.overview, movie.runtime, movie.backdrop_path, movie.vote_average]);
    const genres = movie.genres;
    for (let i = 0; i < genres.length; i++) {
        pool.query(queries.insertMovieGenres, [movie.id, genres[i].id]);
    }
};
module.exports = {
    initializeSession,
    endSession,
    addInteraction,
};