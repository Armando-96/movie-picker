const express = require("express");
const sessionController = require("../controllers/session-controllers.js");

const sessionRoute = express.Router();

sessionRoute.get("/next", sessionController.addInteraction);
sessionRoute.get("/end", sessionController.endSession);

module.exports = sessionRoute;
