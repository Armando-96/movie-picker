const express = require("express");
const sessions = require("express-session");
const path = require("path");
const app = express();

const cookieParser = require("cookie-parser"); //Importiamo il modulo per la gestione dei cookie

const bodyParser = require("body-parser");

// Importazione delle routes
const configurationRoute = require("./routes/configuration-route.js");
const movieRoute = require("./routes/movies-route.js");
const loginRouter = require("./routes/login-route.js");
const signupRouter = require("./routes/signup-route.js");
const sessionRoute = require("./routes/session-route.js");
const watchNowRoute = require("./routes/watchnow-route.js");
const discoveryRoute = require("./routes/discovery-route.js");

const PORT = 3000;
const SIX_HOURS = 1000 * 60 * 60 * 6;

// set the view engine to pug
app.set("view engine", "pug");

//Installiamo il body parser json di express
app.use(express.json());

//Installiamo il middleware per la gestione dei cookie
app.use(cookieParser());

//Installiamo il body parser per le richieste di tipo x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  sessions({
    secret: "secret-string",
    saveUninitialized: true,
    cookie: { maxAge: SIX_HOURS }, // Durata della sessione di massimo 6 ore
    resave: false,
  })
);

// Definizione delle cartelle statiche
app.use(express.static("public"));
// app.use(
//   ["/css", "/bootstrap/js", "/bootstrap/jquery"],
//   [
//     express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
//     express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
//     express.static(path.join(__dirname, "node_modules/jquery/dist")),
//   ]
// );

// Registriamo gli endpoint
app.use("/session", sessionRoute);
app.use("/api/configuration", configurationRoute);
app.use("/api/movies", movieRoute);
app.use("/user/login", loginRouter);
app.use("/user/signup", signupRouter);
app.use("/watchnow", watchNowRoute);
app.use("/discovery", discoveryRoute);

app.get("/test", (req, res) => {
  res.sendFile(path.resolve("./public/test.html"));
});

// Pagina di errore 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});
const { insertGenres } = require("./controllers/configuration-controllers.js");
insertGenres(); // Inserimento dei generi nel database

app.listen(3000, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
