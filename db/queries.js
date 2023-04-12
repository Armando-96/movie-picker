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


module.exports = {
    getUsers,
    getSessions,
    getInteractions,
    getAll,
    getUserById,
    createUser,
    getUserByUsername,
};