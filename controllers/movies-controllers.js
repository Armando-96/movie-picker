const express = require("express");
const axios = require("axios");
const {
    Configuration,
    initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const { TMDB_API_KEY, CONFIGURATION, TOTAL_PAGES_TRENDING } = require("../model/global-variables.js");
const { subMonths, format } = require('date-fns');
const profileController = require("./profile-controllers.js");

const topRated = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
        );
        const movies = response.data.results;
        const randomMovies = [];
        for (let i = 0; i < 100; i++) {
            const randomIndex = Math.floor(Math.random() * movies.length);
            randomMovies.push(new Movie(movies[randomIndex]));
        }

        res.json(randomMovies);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Errore durante la richiesta di film randomici" });
    }
};

const random = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
        );
        const movies = response.data.results;
        const firstMovie = new Movie(
            movies[Math.ceil(Math.random() * movies.length - 1)]
        );
        CONFIGURATION.then((config) => {
            res.render("partials/movie_card.pug", {
                movie: firstMovie,
                config: config,
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

const trending = async (req, res) => {
    try {
        const { page } = req.query;

        if (page > TOTAL_PAGES_TRENDING) return res.status(404).json({ message: "Pagina non trovata" });

        let p = page;
        if (!p) p = 1;
        let movieArray = [];
        while (movieArray.length < 20) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${p}`
            );
            const movies = response.data.results;
            for (let i = 0; i < movies.length; i++) {
                if (movies[i].vote_count > 20) movieArray.push(new Movie(movies[i]));
                if (movieArray.length >= 20) break;
            }
            p++;
        }

        //Chiediamo i video del primo film della lista per cercare il trailer e restituirlo
        const responseVideos = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movieArray[0].id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        )).data;

        let trailerKey = null;
        for (let i = 0; i < responseVideos.results.length; i++) {
            if (responseVideos.results[i].type === "Trailer" && responseVideos.results[i].site === "YouTube") {
                trailerKey = responseVideos.results[i].key;
                break;
            }
        }

        const config = await CONFIGURATION;

        const movies = {
            prefix_poster_path: config.images.base_url + config.images.backdrop_sizes[0],
            results: movieArray,
            trailerKeyFirstMovie: trailerKey,
        }
        res.send(movies);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Errore durante la richiesta film randomico" });
    }
};

const details = async (req, res) => {
    try {
        const { movie_id } = req.query;
        const promiseConfig = CONFIGURATION;

        const promiseResponseVideos = axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );

        const promiseResponseKeywords = axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/keywords?api_key=${TMDB_API_KEY}`
        );

        const promiseResponseCast = axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${TMDB_API_KEY}`
        );

        const promiseResponseImages = axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${TMDB_API_KEY}&language=en-US&include_image_language=en`
        );

        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`
        );


        let genres = [];
        let genres_length = 3;
        if (response.data.genres.length < 3) {
            genres_length = response.data.genres.length;
        }

        for (let i = 0; i < genres_length; i++) {
            genres.push(response.data.genres[i].id);
        }

        const oggi = new Date();
        const unMeseFa = subMonths(oggi, 1);
        const formatoData = "yyyy-MM-dd";
        const dataFormattata = format(unMeseFa, formatoData);

        let responseSimilar = (await axios.get(//Utilizziamo movie discover invece di get similar perchè restituisce film troppo vecchi e senza dati
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_genres=${genres}&sort_by=release_date.desc&release_date.lte=${dataFormattata}&vote_count.gte=100`
        )).data;

        let responses = await Promise.all([promiseResponseVideos, promiseResponseImages, promiseResponseKeywords, promiseResponseCast, promiseConfig]);
        let [responseVideos, responseImages, responseKeywords, responseCast, config] = responses;
        responseVideos = responseVideos.data;
        responseImages = responseImages.data;
        responseKeywords = responseKeywords.data;
        responseCast = responseCast.data;

        for (let i = 0; i < responseSimilar.results.length; i++) {
            if (movie_id == responseSimilar.results[i].id) {
                responseSimilar.results.splice(i, 1);
                break;
            }
        }

        let trailerKey = null;
        for (let i = 0; i < responseVideos.results.length; i++) {
            if (responseVideos.results[i].type === "Trailer" && responseVideos.results[i].site === "YouTube") {
                trailerKey = responseVideos.results[i].key;
                break;
            }
        }

        let user_id = false;
        if (req.session.user_id) user_id = req.session.user_id;
        let favourite = false;
        if (user_id) {
            let movie_id_string = movie_id.toString();
            results = await profileController.checkFavourite(user_id, movie_id_string);
            if (results.length > 0) favourite = true;
        }
        res.render("movie-details.pug",
            {
                movie: response.data,
                trailerKey: trailerKey,
                videos: responseVideos.results,
                posters: responseImages.posters,
                logos: responseImages.logos,
                similar: responseSimilar.results,
                keywords: responseKeywords.keywords,
                cast: responseCast.cast,
                config: config,
                user_id: user_id,
                favourite: favourite,
            });


    } catch (error) {
        console.error(error);
    }

};

const search = async (req, res) => {
    try {
        const promiseConfig = CONFIGURATION;

        const { page, with_genres, year, release_date_gte, sort_by, vote_average_gte, with_people } = req.query;

        let request = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&vote_count.gte=50`;
        if (page) request = request.concat(`&page=${page}`);
        if (with_genres) request = request.concat(`&with_genres=${with_genres}`);
        if (year) request = request.concat(`&primary_release_year=${year}`);
        if (release_date_gte) request = request.concat(`&primary_release_date.gte=${release_date_gte}`);
        if (sort_by) request = request.concat(`&sort_by=${sort_by}`);
        if (vote_average_gte) request = request.concat(`&vote_average.gte=${vote_average_gte}`);
        if (with_people) request = request.concat(`&with_people=${with_people}`);
        const response = await axios.get(request);
        const config = await promiseConfig;

        let toSend = {
            prefix_poster_path: config.images.base_url + config.images.poster_sizes[3],
            page: page,
            results: response.data.results,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results
        };
        res.send(toSend);

    } catch (error) {
        console.error(error);
    }
}

const getGenres = async (req, res) => {
    try {
        const genres = await pool.query(queries.checkGenres);
        res.send(genres.rows);
    } catch (error) {
        console.error(error);
    }
}

const searchPerson = async (req, res) => {
    try {
        const configPromise = CONFIGURATION;

        const { page, query } = req.query;
        const p = page ? page : 1;
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&language=en-US&page=${p}&include_adult=false&query=${query}`
        );

        const config = await configPromise;

        let toSend = {
            prefix_profile_path: config.images.base_url + config.images.profile_sizes[1],
            people: response.data.results,
        }

        res.send(toSend);

    } catch (error) {
        console.error(error);
    }
}

const getHomePageDetails = async (req, res) => {
    try {
        const { movie_id } = req.query;
        const promiseConfig = CONFIGURATION;
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const config = await promiseConfig;
        res.send({
            movie: response.data,
            prefix_poster_path: config.images.base_url + config.images.backdrop_sizes[1],
        });
    } catch (error) {
        console.error(error);
    }
}

const movieByName = async (req, res) => {
    try {
        const promiseConfig = CONFIGURATION;
        const { movie_name } = req.query;
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${movie_name}&page=1&include_adult=false`
        );
        const config = await promiseConfig;
        res.send({
            page: response.data.page,
            movie: response.data.results,
            prefix_poster_path: config.images.base_url + config.images.poster_sizes[3],
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    topRated,
    random,
    trending,
    details,
    search,
    getGenres,
    searchPerson,
    getHomePageDetails,
    movieByName
}