//Query per recuperare tutte le tuple da singole tabelle o da tutte le tabelle
const getUsers = "SELECT * FROM users";
const getSessions = "SELECT * FROM sessions";
const getInteractions = "SELECT * FROM interaction";
const getAll =
  "SELECT * FROM users u full join sessions s on u.id = s.id_user full join interaction i on s.id = i.id_session";
//Altre query
const getUserById = "SELECT * FROM users WHERE id = $1";
const getUserByUsername = "SELECT * FROM users WHERE username = $1";
const createUser = "INSERT INTO users ( username, password) VALUES ($1, $2)";
const getMaxIdSessions = "SELECT MAX(id) FROM sessions";
const createSession = "INSERT INTO sessions ( id, id_user ) VALUES ($1, $2)";
const createInteraction =
  "INSERT INTO interaction ( id_session, id_film, preference ) VALUES ($1, $2, $3)";
const incLikes = "UPDATE sessions SET n_likes = n_likes + 1  WHERE id = $1";
const incViews = "UPDATE sessions SET n_views = n_views + 1  WHERE id = $1";
const checkFilm =
  "SELECT * FROM interaction WHERE id_session = $2 AND id_film = $1";

module.exports = {
  getUsers,
  getSessions,
  getInteractions,
  getAll,
  getUserById,
  createUser,
  getUserByUsername,
  getMaxIdSessions,
  createSession,
  createInteraction,
  incLikes,
  incViews,
  checkFilm,
};
