class Movie {
  constructor(json) {
    this.id = json.id;
    this.title = json.original_title;
    this.overview = json.overview;
    this.poster_path = json.poster_path;
    this.genres = json.genre_ids;
    this.rating = json.vote_average;
  }
}

module.exports = Movie;
