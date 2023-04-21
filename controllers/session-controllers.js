const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const axios = require("axios");
const { TMDB_API_KEY, CONFIGURATION, THRESHOLD_FOR_FILTERING, TOTAL_PAGES_DISCOVER, TOTAL_PAGES_TRENDING } = require("./../model/global-variables.js");
const Movie = require("./../model/movie.js");
const path = require("path");

const getMaxIdSessions = async function getMaxIdSessions() {
    const result = await pool.query(queries.getMaxIdSessions);
    return result.rows[0].max;
};

const createSession = (id_session, id_user) => {
    pool.query(queries.createSession, [id_session, id_user]);
};

const chooseMod = async (req, res) => {
    const { mod } = req.query;
    const user_id = Number(req.cookies.id_user);
    const session_id = Number(req.cookies.id_session);
    const user = (await pool.query(queries.getUserById, [user_id])).rows[0];
    if (mod === "discovery") {
        renderFirstMovie(user, session_id, res);
    } else if (mod === "watchNow") {
        res.send("Modalità watch Now da implementare");
    }
};


const initializeSession = async (user, res) => {
    const id_session = (await getMaxIdSessions()) + 1;
    createSession(id_session, user.user_id);
    //Inseriamo l'id della sessione nel cookie e altri dati di convenienza
    res.cookie("id_session", String(id_session));
    res.cookie("id_user", String(user.user_id));
    res.cookie("username", user.username);
    res.sendFile(path.resolve("./public/scelta.html"));
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

    let num_interazioni = (await pool.query(queries.getInteractionsCount, [req.cookies.id_user])).rows[0].count;
    let next = null;
    if (num_interazioni % 3 != 0)//Ogni 2 film filtrati, viene mostrato un film randomico
        next = await getMovieFunction(req.cookies.id_user);
    else
        next = await getRandomMovie();

    let duplicate = await checkFilm(next.id, id_session);
    let i = 0;
    while (duplicate) {
        num_piaciuti = (await pool.query(queries.countPositive, [Number(req.cookies.id_user)])).rows[0].count;
        if (num_piaciuti > THRESHOLD_FOR_FILTERING) getMovieFunction = getFilteredMovieGenre;
        i++;
        if (i > 50) break;//qui 50 indica il limite prima di considerare i film finiti
        next = await getMovieFunction(req.cookies.id_user);
        duplicate = await checkFilm(next.id, id_session);
    }
    //console.log("Movie: " + next.title + " num_iterazioni resto: " + num_interazioni % 3 + " generi: " + next.genre_ids);//Debug
    if (i <= 50)
        res.send(next);
    else
        res.send({ "nonext": true });//Non ci sono più film da mostrare
}

//Funzione che restituisce un film filtrato in json
const getFilteredMovieGenre = async (user_id) => {
    const magior3Genres = (await pool.query(queries.getMagior3Genres, [user_id])).rows;
    let genresString = "";
    for (let i = 0; i < magior3Genres.length; i++) {
        genresString += magior3Genres[i].genre_id;
        if (i != magior3Genres.length - 1) genresString += ",";
    }

    const page = Math.ceil(Math.random() * TOTAL_PAGES_DISCOVER);

    const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genresString}`
    );
    const movies = response.data.results;
    const scelto = movies[Math.ceil(Math.random() * movies.length - 1)];
    return scelto;
}


//Funzione che restituisce un film randomico in json
//Verranno restituiti film che vengono considerati trand del momento, utilizzando le api nella sezione "Trending"
const getRandomMovie = async () => {
    const page = Math.ceil(Math.random() * TOTAL_PAGES_TRENDING);

    const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
    );

    const movies = response.data.results;
    return movies[Math.ceil(Math.random() * movies.length - 1)];
}

const renderFirstMovie = async (user, id_session, res) => {
    try {
        const movie_json = await getMovieFunction(user.user_id);
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

const getMovieFunction = async (user_id) => {
    let num_piaciuti = (await pool.query(queries.countPositive, [Number(user_id)])).rows[0].count;
    if (num_piaciuti > THRESHOLD_FOR_FILTERING)
        return getFilteredMovieGenre(user_id);
    else
        return getRandomMovie();
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
    renderFirstMovie,
    chooseMod,
};