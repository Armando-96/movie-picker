const express = require("express");
const sessionController = require("../controllers/session-controllers.js");
const sessionRoute = express.Router();

sessionRoute.get("/next", sessionController.addInteractionOld);
sessionRoute.get("/addInteraction", sessionController.addInteraction);
sessionRoute.get("/end", sessionController.endSession);
sessionRoute.get("/", sessionController.chooseMod);
//sessionRoute.get("/torneo", sessionController.torneo);
//sessionRoute.get("/torneo/list", sessionController.torneo); // restituisce al chiamante un file JSON contenente l'array dei movie_id da mostrare

module.exports = sessionRoute;
