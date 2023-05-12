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
const sessionController = require("./session-controllers.js");
const { TMDB_API_KEY, CONFIGURATION, TOTAL_PAGES_TRENDING } = require("../model/global-variables.js");

const getProfilePage = async (req, res) => {
    const { user_id, username } = req.session;
    let favourites = await getFavouritesDetails(user_id);
    if (user_id) {
        res.render("profile-page.pug",
            {
                username: username,
                user_id: user_id,
                favourites: favourites,
                config: await CONFIGURATION,
            });
    }
    else
        res.sendFile(path.resolve("./public/login.html"));
}

const addFavourite = async (req, res) => {
    const { user_id, movie_id } = req.query;
    if (!(await sessionController.checkMovie(movie_id))) await sessionController.insertMovieById(movie_id);

    pool.query("INSERT INTO favourites (user_id, movie_id) values ( $1, $2);", [user_id, movie_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        } else {
            res.status(200).send("OK");
        }
    });
}

const getFavourites = async (user_id) => {
    return (await pool.query("SELECT movie_id FROM favourites WHERE user_id = $1;", [user_id])).rows;
}

const getFavouritesDetails = async (user_id) => {
    return (await pool.query(
        `select * 
            from favourites f join movies m on f.movie_id = m.movie_id
            where user_id = $1;`,
        [user_id])).rows;
}

const checkFavourite = async (user_id, movie_id) => {
    return (await pool.query(`SELECT * FROM favourites WHERE user_id = $1 AND movie_id = $2;`, [user_id, movie_id])).rows;
}


const removeFavourite = async (req, res) => {
    const { user_id, movie_id } = req.query;
    pool.query(`DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2;`, [user_id, movie_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        } else {
            res.status(200).send("OK");
        }
    });
}


module.exports = {
    getProfilePage,
    addFavourite,
    getFavourites,
    getFavouritesDetails,
    removeFavourite,
    checkFavourite,
}