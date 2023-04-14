const express = require("express");
const path = require("path");
const app = express();

const cookieParser = require("cookie-parser"); //Importiamo il modulo per la gestione dei cookie

const dbRoutes = require("./db/routes"); //Le api relative al database
const bodyParser = require("body-parser");

// Importazione delle routes
const configurationRoute = require("./routes/configuration-route.js");
const movieRoute = require("./routes/movies-route.js");
const loginRouter = require("./routes/login-route.js");

const PORT = 3000;

// set the view engine to pug
app.set("view engine", "pug");

//Installiamo il body parser json di express
app.use(express.json());

//Installiamo il middleware per la gestione dei cookie
app.use(cookieParser());

//Installiamo il body parser per le richieste di tipo x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Definizione delle cartelle statiche
app.use(express.static("public"));
app.use(
  ["/css", "/js", "/js"],
  [
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
    express.static(path.join(__dirname, "node_modules/jquery/dist")),
  ]
);

// Registriamo gli endpoint
app.use("/api/db", dbRoutes);
app.use("/api/configuration", configurationRoute);
app.use("/api/movies", movieRoute);
app.use("/api/user/login", loginRouter);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Pagina di errore 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(3000, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
