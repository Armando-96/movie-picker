//Questo file può essere utilizzato per creare funzioni che possono essere richiamate dal router
//per pulizia del codice

const pool = require("./db");
const queries = require("./queries");

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
                res.status(201).send('User added');
            });
        }

    });

};



module.exports = {
    getUsers,
    getSessions,
    getInteractions,
    getAll,
    getUserById,
    createUser,
};
