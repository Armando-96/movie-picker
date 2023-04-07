const Movie = require("./model/movie.js");
const Configuration = require("./model/configuration.js");
const axios = require("axios");
const pug = require("pug");
const express = require("express");
const path = require("path");
const app = express();
//Le api relative al database
const dbRoutes = require("./db/routes");


// My functions
const { initialConfiguration } = require("./configure.js");

const PORT = 3000;

// APY KEY per il database TMDB
const TMDB_API_KEY = "fcece093f96283eb8c3865c3be14e4d4";
const CONFIGURATION = initialConfiguration(TMDB_API_KEY);

// set the view engine to pug
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

//Impostiamo il middleware per la gestione delle api relative al database
app.use("/api/db", dbRoutes);
//Installiamo il body parser json di express
app.use(express.json());

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "public", "404.html"));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/movies/top_rated", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const movies = response.data.results;
    const randomMovies = [];
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      randomMovies.push(new Movie(movies[randomIndex]));
    }

    res.json(randomMovies);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante la richiesta di film randomici" });
  }
});

app.get("/api/configuration", async (req, res) => {
  const getConfigurations = initialConfiguration(TMDB_API_KEY);
  getConfigurations
    .then((config) => {
      let configuration = new Configuration(config);
      res.json(configuration);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/movies/random", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const movies = response.data.results;
    const firstMovie = new Movie(
      movies[Math.ceil(Math.random() * movies.length - 1)]
    );
    CONFIGURATION.then((config) => {
      res.render("partials/movie_card.pug", {
        movie: firstMovie,
        config: config,
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante la richiesta film randomico" });
  }
});

app.listen(3000, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
