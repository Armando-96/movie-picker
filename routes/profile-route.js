const express = require("express");
const axios = require("axios");
const {
  Configuration,
  initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const {
  TMDB_API_KEY,
  CONFIGURATION,
  TOTAL_PAGES_TRENDING,
} = require("../model/global-variables.js");

const profileRoute = express.Router();
const profileController = require("../controllers/profile-controllers.js");

profileRoute.get("/", profileController.getProfilePage);

profileRoute.get("/addFav", profileController.addFavourite);

profileRoute.get("/removeFav", profileController.removeFavourite);

module.exports = profileRoute;
