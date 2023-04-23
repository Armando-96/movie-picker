const express = require("express");
const sessionController = require("../controllers/session-controllers.js");
const sessionRoute = express.Router();

sessionRoute.get("/next", sessionController.addInteraction);
sessionRoute.get("/end", sessionController.endSession);
sessionRoute.get("/", sessionController.chooseMod);
sessionRoute.get("/getLike", sessionController.getNumLikeInSession);
sessionRoute.get("/getLikeMovies", sessionController.getLikeMovies);
module.exports = sessionRoute;
