//Questo file può essere utilizzato per creare funzioni che possono essere richiamate dal router
//per pulizia del codice

const pool = require("./db");
const queries = require("./queries");
const path = require("path");
const { getMovie, initializeSession, checkFilm } = require("./utils");

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getSessions = (req, res) => {
    pool.query(queries.getSessions, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getInteractions = (req, res) => {
    pool.query(queries.getInteractions, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getAll = (req, res) => {
    pool.query(queries.getAll, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUserById, [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createUser = (req, res) => {
    const { username, password } = req.body;
    pool.query(queries.getUserByUsername, [username], (error, results) => {
        if (error) {
            throw error;
        }
        const exist = results.rows.length;

        if (exist) {
            res.status(400).send("Username already exists");
        } else {
            pool.query(queries.createUser, [username, password], (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).sendFile(path.resolve("./public/login.html"));
            });
        }

    });

};

const login = async (req, res) => {
    const { username, password } = req.body;
    const results = await pool.query(queries.getUserByUsername, [username]);
    const exist = results.rows.length;
    if (exist) {
        const user = results.rows[0];
        if (user.password === password) {
            initializeSession(user, res)//Ora c'è solo discovery, ma poi andrà messa una schermata di scelta fra discovery e watch now
        } else {
            res.status(400).send("Wrong password");
        }
    } else {
        res.status(400).send("Username doesn't exist");
    }
}

const addInteraction = async (req, res) => {
    const { preference, id_movie } = req.query;
    const id_session = Number(req.cookies.id_session);

    if (!(await checkFilm(id_movie, id_session))) {
        pool.query(queries.createInteraction, [id_session, id_movie, preference]);
        pool.query(queries.incViews, [id_session]);
        if (preference === "like")
            pool.query(queries.incLikes, [id_session]);
    }

    let next = await getMovie();
    let duplicate = await checkFilm(next.id, id_session);
    let i = 0;
    while (duplicate) {
        i++;
        if (i > 50) break;
        console.log("Duplicate found");
        next = await getMovie();
        duplicate = await checkFilm(next.id, id_session);
    }
    if (i <= 50)
        res.send(next);
    else
        res.send({ "nonext": true });//Non ci sono più film da mostrare
}

const endSession = async (req, res) => {
    //Eliminiamo i cookie
    res.clearCookie("id_session");
    res.clearCookie("id_user");
    res.clearCookie("username");
    res.send("Session ended pagina di buona visione");
}


module.exports = {
    getUsers,
    getSessions,
    getInteractions,
    getAll,
    getUserById,
    createUser,
    login,
    addInteraction,
    endSession,
};
