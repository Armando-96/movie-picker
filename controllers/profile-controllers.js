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
const {
  TMDB_API_KEY,
  CONFIGURATION,
  TOTAL_PAGES_TRENDING,
} = require("../model/global-variables.js");

const getProfilePage = async (req, res) => {
  const { user_id, username } = req.session;
  let promiseFavourites = getFavouritesDetails(user_id);
  let promiseGenreStatics = getGenreStatics(user_id);
  let promiseMostLikedActors = getMostLikedActors(user_id);

  let favourites = await promiseFavourites;
  let genreStatics = await promiseGenreStatics;
  let mostLikedActors = await promiseMostLikedActors;

  if (user_id) {
    res.render("profile-page.pug", {
      username: username,
      user_id: user_id,
      favourites: favourites,
      genreStatics: genreStatics,
      mostLikedActors: mostLikedActors,
      config: await CONFIGURATION,
    });
  } else res.redirect("user/login?from_home=true");
};

const addFavourite = async (req, res) => {
  const { user_id, movie_id } = req.query;
  if (!(await sessionController.checkMovie(movie_id)))
    await sessionController.insertMovieById(movie_id);

  pool.query(
    "INSERT INTO favourites (user_id, movie_id) values ( $1, $2);",
    [user_id, movie_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("OK");
      }
    }
  );
};

const getFavourites = async (user_id) => {
  return (
    await pool.query("SELECT movie_id FROM favourites WHERE user_id = $1;", [
      user_id,
    ])
  ).rows;
};

const getFavouritesDetails = async (user_id) => {
  return (
    await pool.query(
      `select * 
            from favourites f join movies m on f.movie_id = m.movie_id
            where user_id = $1;`,
      [user_id]
    )
  ).rows;
};

const checkFavourite = async (user_id, movie_id) => {
  return (
    await pool.query(
      `SELECT * FROM favourites WHERE user_id = $1 AND movie_id = $2;`,
      [user_id, movie_id]
    )
  ).rows;
};

const checkFavouriteBool = async (req, res) => {
  const { user_id, movie_id } = req.query;
  let result = await checkFavourite(user_id, movie_id);
  if (result.length > 0) res.status(200).send("true");
  else res.status(200).send("false");
};

const removeFavourite = async (req, res) => {
  const { user_id, movie_id } = req.query;
  pool.query(
    `DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2;`,
    [user_id, movie_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("OK");
      }
    }
  );
};

const getGenreStatics = async (user_id) => {
  return (await pool.query(queries.getGenreStatics, [user_id])).rows;
};

const getMostLikedActors = async (user_id) => {
  const movies_id = (
    await pool.query(
      "SELECT movie_id FROM interactions i JOIN sessions s ON i.session_id = s.session_id WHERE user_id = $1 ORDER BY interaction_date limit 50;",
      [user_id]
    )
  ).rows;
  let actors = {};
  let actorsValues = {};
  let promises = [];

  for (let i = 0; i < movies_id.length; i++) {
    promises.push(
      axios.get(
        `https://api.themoviedb.org/3/movie/${movies_id[i].movie_id}/credits?api_key=${TMDB_API_KEY}`
      )
    );
  }
  for (let i = 0; i < promises.length; i++) {
    await promises[i].then((result) => {
      let cast = result.data.cast;
      for (let j = 0; j < cast.length; j++) {
        if (!actors[cast[j].id]) {
          actors[cast[j].id] = 1;
          let actor = {
            id: cast[j].id,
            name: cast[j].name,
            profile_path: cast[j].profile_path,
          };
          actorsValues[cast[j].id] = actor;
        } else actors[cast[j].id]++;
      }
    });
  }

  const entries = Object.entries(actors);
  entries.sort((a, b) => b[1] - a[1]);
  let fisrt10ActorsId = entries.slice(0, 20);

  let ret = [];
  for (let i = 0; i < fisrt10ActorsId.length; i++) {
    actorsValues[fisrt10ActorsId[i][0]].count = fisrt10ActorsId[i][1];
    ret.push(actorsValues[fisrt10ActorsId[i][0]]);
  }
  return ret;
};

module.exports = {
  getProfilePage,
  addFavourite,
  getFavourites,
  getFavouritesDetails,
  removeFavourite,
  checkFavourite,
  getGenreStatics,
  getMostLikedActors,
  checkFavouriteBool,
};
