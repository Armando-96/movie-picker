const express = require("express");
const axios = require("axios");
const {
    Configuration,
    initialConfiguration,
} = require("../model/configuration.js");
const Movie = require("../model/movie.js");
const pool = require("./../db/db.js");
const queries = require("./../db/queries.js");
const path = require("path");
const { TMDB_API_KEY, CONFIGURATION, TOTAL_PAGES_TRENDING } = require("../model/global-variables.js");

const getProfilePage = async (req, res) => {
    const { user_id, username } = req.session;
    if (user_id) {
        res.render("profile-page.pug",
            {
                username: username,
                user_id: user_id,
            });
    }
    else
        res.sendFile(path.resolve("./public/login.html"));
}

module.exports = {
    getProfilePage,
}