const express = require("express");
const axios = require("axios");
const {
  Configuration,
  initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const { TMDB_API_KEY, CONFIGURATION } = require("../model/global-variables.js");

const moviesRoute = express.Router();

moviesRoute.get("/top_rated", async (req, res) => {
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
});

moviesRoute.get("/random", async (req, res) => {
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
});

module.exports = moviesRoute;
