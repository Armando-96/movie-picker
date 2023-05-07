const express = require("express");
const axios = require("axios");
const {
    Configuration,
    initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const { TMDB_API_KEY, CONFIGURATION, TOTAL_PAGES_TRENDING } = require("../model/global-variables.js");

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

        const response = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
        );

        const config = await CONFIGURATION;

        const movies = {
            prefix_poster_path: config.images.base_url + config.images.backdrop_sizes[0],
            page: response.data.page,
            results: response.data.results
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
        const config = await CONFIGURATION;
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        const responseVideos = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        )).data;

        const responseKeywords = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/keywords?api_key=${TMDB_API_KEY}`
        )).data;

        const responseCast = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${TMDB_API_KEY}`
        )).data.cast;

        const responseImages = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${TMDB_API_KEY}&language=en-US&include_image_language=en`
        )).data;

        const responseSimilar = (await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        )).data;

        let trailerKey = null;
        for (let i = 0; i < responseVideos.results.length; i++) {
            if (responseVideos.results[i].type === "Trailer" && responseVideos.results[i].site === "YouTube") {
                trailerKey = responseVideos.results[i].key;
                break;
            }
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
                cast: responseCast,
                config: config
            });
    } catch (error) {
        console.error(error);
    }
};

const search = async (req, res) => {
    try {
        const { page, with_genres, year, release_date_gte, sort_by, vote_average_gte, with_people } = req.query;

        let request = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US`;
        if (page) request = request.concat(`&page=${page}`);
        if (with_genres) request = request.concat(`&with_genres=${with_genres}`);
        if (year) request = request.concat(`&year=${year}`);
        if (release_date_gte) request = request.concat(`&release_date.gte=${release_date_gte}`);
        if (sort_by) request = request.concat(`&sort_by=${sort_by}`);
        if (vote_average_gte) request = request.concat(`&vote_average.gte=${vote_average_gte}`);
        if (with_people) request = request.concat(`&with_people=${with_people}`);

        const response = await axios.get(request);
        res.send(response.data);
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
}