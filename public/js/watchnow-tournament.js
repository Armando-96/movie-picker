var movies;
var leftMovieId;
var rightMovieId;

$("document").ready(function () {
  $.get("/watchnow/getLikeMovies", function (data, status) {
    if (status == "success") {
      movies = JSON.parse(data); // movies è un array di oggetti Movie
      updateLeft();
      updateRight();
    } else {
      alert("Errore nella richiesta di getLikeMovies");
    }
  });
});

function getMovie() {
  if (movies.length == 0) {
    return null;
  }
  var index = Math.floor(Math.random() * movies.length);
  var movie = movies[index];
  movies.splice(index, 1);
  return movie;
}

function updateLeft() {
  let left = getMovie();
  if (left == null) {
    finalMovie("right");
    return;
  }
  $(".left-movie-card .title").html(left.title);
  $(".left-movie-card .rating").html(left.rating);
  $(".left-movie-card .overview").html(left.overview);
  $(".left-movie-card .poster").attr(
    "src",
    left.poster_path == null || left.poster_path == "Non disponibile"
      ? "/images/image-placeholder.png"
      : prefix_poster_path + left.poster_path
  );
  leftMovieId = left.movie_id;
}

function updateRight() {
  let right = getMovie();
  if (right == null) {
    finalMovie("left");
    return;
  }
  $(".right-movie-card .title").html(right.title);
  $(".right-movie-card .rating").html(right.rating);
  $(".right-movie-card .overview").html(right.overview);
  $(".right-movie-card .poster").attr(
    "src",
    right.poster_path == null || right.poster_path == "Non disponibile"
      ? "/images/image-placeholder.png"
      : prefix_poster_path + right.poster_path
  );
  rightMovieId = right.movie_id;
}

function finalMovie(position) {
  if (position == "left") {
    window.location.replace("/watchnow/final?movie=" + leftMovieId);
  } else if (position == "right") {
    window.location.replace("/watchnow/final?movie=" + rightMovieId);
  }
}

$("#left").click(function () {
  updateRight();
});

$("#right").click(function () {
  updateLeft();
});

function exit() {
  window.location.replace("/user/login");
}
