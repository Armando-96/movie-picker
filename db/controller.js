//Questo file può essere utilizzato per creare funzioni che possono essere richiamate dal router
//per pulizia del codice

const pool = require("./db");
const queries = require("./queries");
//DA TESTARE
const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};


module.exports = {
    getUsers,
};
