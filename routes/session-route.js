const express = require("express");
const sessionController = require("../controllers/session-controllers.js");
const sessionRoute = express.Router();

sessionRoute.get("/next", sessionController.addInteractionOld);
sessionRoute.get("/addInteraction", sessionController.addInteraction);
sessionRoute.get("/end", sessionController.endSession);
sessionRoute.get("/", sessionController.chooseMod);

module.exports = sessionRoute;
