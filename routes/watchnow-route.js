const express = require("express");
const watchNowController = require("../controllers/watchnow-controllers.js");
const watchNowRoute = express.Router();

watchNowRoute.use("/", watchNowController.checkLogin); // il middleware checkLogin viene eseguito per ogni richiesta e prende come terzo argomento next.

watchNowRoute.get("/", watchNowController.initial);
watchNowRoute.get("/getNumLike", watchNowController.getNumLikeInSession);
watchNowRoute.get("/getLikeMovies", watchNowController.getLikeMovies);
watchNowRoute.get("/tournament", watchNowController.tournament);
watchNowRoute.get("/final", watchNowController.final);
//sessionRoute.get("/tournament/list", sessionController.tournament); // restituisce al chiamante un file JSON contenente l'array dei movie_id da mostrare

module.exports = watchNowRoute;
