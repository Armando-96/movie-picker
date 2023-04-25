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

const chooseMod = async (req, res) => {
    /*//Probabilmente crea problemi
    if (!req.session.user_id) {
        res.redirect(301, "/user/login");
        return;
    }
    */
    const { mod } = req.query;
    const user_id = Number(req.session.user_id);
    const session_id = await initializeSession(user_id, req, res);
    const user = (await pool.query(queries.getUserById, [user_id])).rows[0];
    if (mod === "discovery") {
        renderFirstMovieDiscovery(user, session_id, res);
    } else if (mod === "watchNow") {
        renderFirstMovieWhatchNow(user, session_id, res);
    }
};

const initializeSession = async (user_id, req, res) => {
    const { session_id } = (await pool.query(queries.createSession, [user_id])).rows[0];
    req.session.session_id = session_id;
    return session_id;
};

const endSession = async (req, res) => {
    //Eliminiamo i cookie
    res.clearCookie("session_id");
    res.clearCookie("user_id");
    res.clearCookie("username");
    res.send("Session ended pagina di buona visione");
};

const addInteractionOld = async (req, res) => {
    const { preference, movie_id } = req.query;
    const session_id = Number(req.session.session_id);
    const movie = (
        await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`
        )
    ).data;
    if (!(await checkFilm(movie_id, session_id))) {
        if (!(await checkMovie(movie_id))) {
            await insertMovie(movie);
        }
        pool.query(queries.createInteraction, [session_id, movie_id, preference]);
        pool.query(queries.incViews, [session_id]);
        if (preference === "like") pool.query(queries.incLikes, [session_id]);
    }

    let num_interazioni = (
        await pool.query(queries.getInteractionsCount, [req.session.user_id])
    ).rows[0].count;
    let next = null;
    if (num_interazioni % 3 != 0)
        //Ogni 2 film filtrati, viene mostrato un film randomico
        next = await getMovieFunction(req.session.user_id);
    else next = await getRandomMovie();

    let duplicate = await checkFilm(next.id, session_id);
    let i = 0;
    while (duplicate) {
        num_piaciuti = (
            await pool.query(queries.countPositive, [Number(req.session.user_id)])
        ).rows[0].count;
        if (num_piaciuti > THRESHOLD_FOR_FILTERING)
            getMovieFunction = getFilteredMovieGenre;
        i++;
        if (i > 50) break; //qui 50 indica il limite prima di considerare i film finiti
        next = await getMovieFunction(req.session.user_id);
        duplicate = await checkFilm(next.id, session_id);
    }
    //console.log("Movie: " + next.title + " num_iterazioni resto: " + num_interazioni % 3 + " generi: " + next.genre_ids);//Debug
    if (i <= 50) res.send(next);
    else res.send({ nonext: true }); //Non ci sono più film da mostrare
};

const addInteraction = async (req, res) => {
    const { preference, movie_id, session_id } = req.query;
    user_id = (await pool.query("select user_id from sessions where session_id = $1", [session_id])).rows[0].user_id;

    const movie = (
        await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`
        )
    ).data;

    if (!(await checkFilm(movie_id, session_id))) {
        if (!(await checkMovie(movie_id))) {
            await insertMovie(movie);
        }
        pool.query(queries.createInteraction, [session_id, movie_id, preference]);
        pool.query(queries.incViews, [session_id]);
        if (preference === "like") pool.query(queries.incLikes, [session_id]);
    }

    let num_interazioni = (
        await pool.query(queries.getInteractionsCount, [user_id])
    ).rows[0].count;
    let next = null;
    if (num_interazioni % 3 != 0)
        //Ogni 2 film filtrati, viene mostrato un film randomico
        next = await getMovieFunction(user_id);
    else next = await getRandomMovie();

    let duplicate = await checkFilm(next.id, session_id);
    let i = 0;
    while (duplicate) {
        num_piaciuti = (
            await pool.query(queries.countPositive, [Number(user_id)])
        ).rows[0].count;
        if (num_piaciuti > THRESHOLD_FOR_FILTERING)
            getMovieFunction = getFilteredMovieGenre;
        i++;
        if (i > 50) break; //qui 50 indica il limite prima di considerare i film finiti
        next = await getMovieFunction(user_id);
        duplicate = await checkFilm(next.id, session_id);
    }
    //console.log("Movie: " + next.title + " num_iterazioni resto: " + num_interazioni % 3 + " generi: " + next.genre_ids);//Debug
    if (i <= 50) res.send(next);
    else res.send({ nonext: true }); //Non ci sono più film da mostrare
};

//Funzione che restituisce un film filtrato in json
const getFilteredMovieGenre = async (user_id) => {
    const magior3Genres = (await pool.query(queries.getMagior2Genres, [user_id]))
        .rows;
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
};

//Funzione che restituisce un film randomico in json
//Verranno restituiti film che vengono considerati trand del momento, utilizzando le api nella sezione "Trending"
const getRandomMovie = async () => {
    const page = Math.ceil(Math.random() * TOTAL_PAGES_TRENDING);

    const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
    );

    const movies = response.data.results;
    return movies[Math.ceil(Math.random() * movies.length - 1)];
};

const renderFirstMovieDiscovery = async (user, session_id, res) => {
    try {
        const movie_json = await getMovieFunction(user.user_id);
        const firstMovie = new Movie(movie_json);

        CONFIGURATION.then((config) => {
            res.render("partials/movie_card.pug", {
                movie: firstMovie,
                config: config,
                username: user.username,
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

const renderFirstMovieWhatchNow = async (user, session_id, res) => {
    try {
        const movie_json = await getMovieFunction(user.user_id);
        const firstMovie = new Movie(movie_json);
        CONFIGURATION.then((config) => {
            res.render("partials/movie_card.pug", {
                movie: firstMovie,
                config: config,
                username: user.username,
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

const getMovieFunction = async (user_id) => {
    let num_piaciuti = (
        await pool.query(queries.countPositive, [Number(user_id)])
    ).rows[0].count;
    if (num_piaciuti > THRESHOLD_FOR_FILTERING)
        return getFilteredMovieGenre(user_id);
    else return getRandomMovie();
};

const checkFilm = async (movie_id, session_id) => {
    //Controlla se il film è già stato mostrato nella sessione
    const result = await pool.query(queries.checkFilm, [movie_id, session_id]);
    return result.rows.length;
};

const checkMovie = async (movie_id) => {
    //Controlla se il film è già presente nel database
    const result = await pool.query(queries.checkMovie, [movie_id]);
    return result.rows.length;
};

const insertMovie = async (movie) => {
    if (movie.backdrop_path == null) movie.backdrop_path = "Non disponibile";
    await pool.query(queries.insertMovie, [
        movie.id,
        movie.title,
        movie.overview,
        movie.runtime,
        movie.backdrop_path,
        movie.vote_average,
    ]);
    const genres = movie.genres;
    for (let i = 0; i < genres.length; i++) {
        pool.query(queries.insertMovieGenres, [movie.id, genres[i].id]);
    }
};

module.exports = {
    initializeSession,
    endSession,
    addInteractionOld,
    chooseMod,
    addInteraction,
};
