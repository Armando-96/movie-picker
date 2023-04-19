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
    renderFirstMovie(user, id_session, res);
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

    let num_piaciuti = (await pool.query(queries.countPositive, [Number(req.cookies.id_user)])).rows[0].count;
    let getMovieFunction = getRandomMovie;
    if (num_piaciuti > 50) getMovieFunction = getFilteredMovieGenre;

    let next = await getMovieFunction(req.cookies.id_user);
    let duplicate = await checkFilm(next.id, id_session);
    let i = 0;
    while (duplicate) {
        num_piaciuti = (await pool.query(queries.countPositive, [Number(req.cookies.id_user)])).rows[0].count;
        if (num_piaciuti > 50) getMovieFunction = getFilteredMovieGenre;
        i++;
        if (i > 50) break;
        next = await getMovieFunction(req.cookies.id_user);
        duplicate = await checkFilm(next.id, id_session);
    }
    if (i <= 50)
        res.send(next);
    else
        res.send({ "nonext": true });//Non ci sono più film da mostrare
}

//Funzione che restituisce un film filtrato in json
const getFilteredMovieGenre = async (user_id) => {
    return getRandomMovie();//temp
    const magior3Genres = (await pool.query(queries.getMagior3Genres, [user_id])).rows;
    const genresString = magior3Genres.map((genre) => genre.genre_id).join(",");

    const total_pages = Number((await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_genres=${genresString}`)).data.total_pages);
    const page = Math.ceil(Math.random() * total_pages);

    const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genresString}`
    );
    const movies = response.data.results;
    const scelto = movies[Math.ceil(Math.random() * movies.length - 1)];
    console.log("Stringa generi: " + genresString + "generi restituito: " + scelto.genre_ids);
    return scelto;
}


//Funzione che restituisce un film randomico in json
//Verranno restituiti film che vengono considerati trand del momento, utilizzando le api nella sezione "Trending"
const getRandomMovie = async () => {
    const total_pages = Number((await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=1`)).data.total_pages);
    const page = Math.ceil(Math.random() * total_pages);

    const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
    );

    const movies = response.data.results;
    return movies[Math.ceil(Math.random() * movies.length - 1)];

}

//Funzione che restituisce un film randomico in json
const getMovie = async () => {
    const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const movies = response.data.results;
    return movies[Math.ceil(Math.random() * movies.length - 1)];
};

const renderFirstMovie = async (user, id_session, res) => {
    try {
        let num_piaciuti = (await pool.query(queries.countPositive, [Number(user.user_id)])).rows[0].count;
        let getMovieFunction = getRandomMovie;
        if (num_piaciuti > 50) getMovieFunction = getFilteredMovieGenre;

        const movie_json = await getMovieFunction(user.id);
        const firstMovie = new Movie(movie_json);

        CONFIGURATION.then((config) => {
            res.render("partials/movie_card.pug", {
                movie: firstMovie,
                config: config,
                username: user.username,
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

const checkFilm = async (id_movie, id_session) => {//Controlla se il film è già stato mostrato nella sessione
    const result = await pool.query(queries.checkFilm, [id_movie, id_session]);
    return result.rows.length;
};

const checkMovie = async (id_movie) => {//Controlla se il film è già presente nel database
    const result = await pool.query(queries.checkMovie, [id_movie]);
    return result.rows.length;
};

const insertMovie = async (movie) => {
    if (movie.backdrop_path == null) movie.backdrop_path = "Non disponibile";
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