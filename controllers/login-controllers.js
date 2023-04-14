const pool = require("./../db/db.js");

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const results = await pool.query(queries.getUserByUsername, [username]);
  const exist = results.rows.length;
  if (exist) {
    const user = results.rows[0];
    if (user.password === password) {
      initializeSession(user, res); //Ora c'è solo discovery, ma poi andrà messa una schermata di scelta fra discovery e watch now
    } else {
      res.status(400).send("Wrong password");
    }
  } else {
    res.status(400).send("Username doesn't exist");
  }
};

const initializeSession = async (user, res) => {
  const id_session = (await getMaxIdSessions()) + 1;
  createSession(id_session, user.id);
  //Inseriamo l'id della sessione nel cookie e altri dati di convenienza
  res.cookie("id_session", String(id_session));
  res.cookie("id_user", String(user.id));
  res.cookie("username", user.username);
  renderFirstMovie(user.username, id_session, res);
};
