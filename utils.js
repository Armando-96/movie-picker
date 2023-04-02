const axios = require('axios');
const express = require('express');
const app = express();

const TMDB_API_KEY = 'TUO_API_KEY';

app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`);
    const movies = response.data.results;
    const randomMovies = [];
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      randomMovies.push(movies[randomIndex]);
    }
    res.json(randomMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante la richiesta di film randomici' });
  }
});

app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
/*
  In questa funzione, utilizziamo la libreria Axios per effettuare una richiesta GET all'API di TMDB per i film più votati. Quindi, selezioniamo casualmente 100 film
  da questa lista utilizzando un ciclo for e il metodo Math.random(). Infine, restituiamo questi film come JSON alla richiesta del client tramite il metodo res.json().
  Assicurati di sostituire "TUO_API_KEY" con la tua chiave API di TMDB per far funzionare correttamente la funzione.
*/
