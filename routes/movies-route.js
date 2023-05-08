const express = require("express");
const axios = require("axios");
const {
  Configuration,
  initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const { TMDB_API_KEY, CONFIGURATION, TOTAL_PAGES_TRENDING } = require("../model/global-variables.js");
const movieController = require("../controllers/movies-controllers.js");

const moviesRoute = express.Router();

moviesRoute.get("/top_rated", movieController.topRated);

moviesRoute.get("/random", movieController.random);

moviesRoute.get("/trending", movieController.trending);

moviesRoute.get("/details", movieController.details);

moviesRoute.get("/search", movieController.search);

moviesRoute.get("/search/getGenres", movieController.getGenres);

module.exports = moviesRoute;
