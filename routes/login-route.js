const express = require("express");
const axios = require("axios");
const path = require("path");
const {
  Configuration,
  initialConfiguration,
} = require("../model/configuration.js");
const { login } = require("./../controllers/login-controllers.js");
const Movie = require("../model/movie.js");
const { TMDB_API_KEY, CONFIGURATION } = require("../model/global-variables.js");

loginRouter = express.Router();

loginRouter.post("/", login);

loginRouter.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/login.html"));
});

module.exports = loginRouter;
