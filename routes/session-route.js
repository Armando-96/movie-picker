const express = require("express");
const axios = require("axios");
const {
    Configuration,
    initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const { TMDB_API_KEY, CONFIGURATION } = require("../model/global-variables.js");
const sessionController = require("../controllers/session-controllers.js");

const sessionRoute = express.Router();

sessionRoute.get('/next', sessionController.addInteraction);
sessionRoute.get('/end', sessionController.endSession);

module.exports = sessionRoute;