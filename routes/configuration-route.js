const express = require("express");
const {
  Configuration,
  initialConfiguration,
} = require("../model/configuration.js");
const { TMDB_API_KEY } = require("../model/global-variables.js");
const configurationRouter = express.Router();

configurationRouter.get("/", async (req, res) => {
  const getConfigurations = initialConfiguration(TMDB_API_KEY);
  getConfigurations
    .then((config) => {
      let configuration = new Configuration(config);
      res.json(configuration);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = configurationRouter;
