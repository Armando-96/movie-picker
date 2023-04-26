const express = require("express");
const whatchNowController = require("../controllers/watchnow-controllers.js");
const watchNowRoute = express.Router();

watchNowRoute.get("/", whatchNowController.initial);
watchNowRoute.get("/getNumLike", whatchNowController.getNumLikeInSession);
watchNowRoute.get("/getLikeMovies", whatchNowController.getLikeMovies);
//sessionRoute.get("/torneo", sessionController.torneo);
//sessionRoute.get("/torneo/list", sessionController.torneo); // restituisce al chiamante un file JSON contenente l'array dei movie_id da mostrare

module.exports = watchNowRoute;
