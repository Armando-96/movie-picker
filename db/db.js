//pg.pool restituisce un oggetto che rappresenta il pool di connessioni al database
//Tale oggetto permette di creare e mantenere un insieme di connessioni aperte al database
//in tal modo non è necessario aprire e chiudere connessioni ad ogni richiesta
//risparmiando tempo e risorse
const Pool = require('pg').Pool;

//creiamo un oggetto pool che rappresenta il pool di connessioni ad un database
//con questo oggetto più client possono accedere al database, il numero di client che possono accedere
//al database è dato dal parametro max di default è 10
//se dobbiamo connetterci a più database, dobbiamo creare più oggetti pool
const pool = new Pool({
    user: 'postgres',//cambiare a seconda del nome utente utilizzato per accedere al database
    host: 'localhost',
    database: 'moviepicker', //cambiare a seconda del nome del database utilizzato
    password: 'postgres', //cambiare a seconda della password utilizzata per accedere al database
    port: 5432,
});

module.exports = pool;