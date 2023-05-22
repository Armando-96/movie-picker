const bcrypt = require("bcrypt");
const pool = require("./../db/db.js");
const path = require("path");
const queries = require("./../db/queries.js");
const { initializeSession } = require("./session-controllers.js");

let session;
module.exports.loginPost = async (req, res) => {
  const { from_home } = req.query;
  const { username, password } = req.body;
  const results = await pool.query(
    "SELECT user_id, username, bcrypt_hash FROM users WHERE username = $1",
    [username]
  );
  if (results.rows.length) {
    const { bcrypt_hash } = results.rows[0];
    bcrypt.compare(password, bcrypt_hash, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("Errore elaborazione password");
      }
      if (result) {
        const user = results.rows[0];
        console.log("variabile user", user);
        req.session.username = username;
        req.session.user_id = user.user_id;
        req.session.username = user.username;
        //res.cookie("user_id", String(user.user_id));
        //res.cookie("username", user.username);
        if (from_home === "true") res.redirect("/profile");
        else res.sendFile(path.resolve("./public/scelta.html"));
        //initializeSession(user, res);
        // res.send("Complimenti ti sei loggato con successo!");
      } else res.status(400).send("Password errata");
    });
  } else {
    res.status(400).send("Username doesn't exist");
  }
};

module.exports.loginGet = (req, res) => {
  if (req.session.username) {
    let username = req.session.username;
    res.sendFile(path.resolve("./public/scelta.html"));
    //initializeSession(username, res);
  } else res.sendFile(path.resolve("./public/login.html"));
};
