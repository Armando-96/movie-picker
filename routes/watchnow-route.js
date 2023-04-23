const express = require("express");
const sessionController = require("../controllers/session-controllers.js");
const whatchNowController = require("../controllers/watchnow-controllers.js");
const watchNowRoute = express.Router();

watchNowRoute.get("/getLike", whatchNowController.getNumLikeInSession);
watchNowRoute.get("/getLikeMovies", whatchNowController.getLikeMovies);

module.exports = watchNowRoute;