$(".card-reveal").hide();
$(".bi-share-fill").click(function () {
  $(".card-reveal").slideDown("150");
});
$(".bi-x-lg").click(function () {
  $(".card-reveal").slideUp("150");
});

function addInteraction(preference_choice) {
  preference = preference_choice;
  $.get({
    async: false,
    url:
      "/session/next" +
      "?" +
      "preference=" +
      preference +
      "&" +
      "movie_id=" +
      movie_id1,
    success: function (data) {
      if (data.nonext) {
        $("#body").html("<h1>Non ci sono più film da mostrare</h1>");
      } else if (preference_choice == "selected") {
        $("#body").html("<h1>Film selezionato</h1>"); //In attesa di sviluppo, da inserire una pagina di ringraziamenti o qualcosa del genere
        return;
      } else {
        if ($("#cumulator").text() == "16/16") return;
        swap(data);
      }
    },
    error: function () {
      alert("Errore nella richiesta");
    },
  });
  if (preference_choice === "like") {
    $.get({
      async: false,
      url: "/watchnow/getNumLike",
      success: function (data) {
        json = JSON.parse(data);
        if (json.n_likes >= 16) {
          window.location.replace("/watchnow/tournament");
          return;
        }
        $("#cumulator").text(json.n_likes + "/16");
        $("#cumulator").css("width", (json.n_likes / 16) * 100 + "%");
      },
      error: function () {
        alert("Errore nella richiesta di getNumLike");
      },
    });
  }
}

$("#dislike").click(function () {
  addInteraction("dislike");
});

$("#like").click(function () {
  addInteraction("like");
});

//Da modificare il database oppure la funzione addInteraction
$("#select").click(function () {
  addInteraction("selected");
});

// Scambia il secondo film "dietro" con il primo film "davanti"
// e imposta come film "dietro" il film passato da new_movie_id
function swap(new_movie) {
  movie_id1 = movie_id2;
  movie_id2 = new_movie.id;
  $(".first-movie-card .title").html($(".second-movie-card .title").html());
  $(".first-movie-card .rating").html($(".second-movie-card .rating").html());
  $(".first-movie-card .overview").html(
    $(".second-movie-card .overview").html()
  );
  $(".first-movie-card .poster").attr(
    "src",
    $(".second-movie-card .poster").attr("src")
  );

  $(".second-movie-card .title").html(new_movie.title);
  $(".second-movie-card .rating").html(new_movie.vote_average);
  $(".second-movie-card .overview").html(new_movie.overview);
  $(".second-movie-card .poster").attr(
    "src",
    prefix_poster_path + new_movie.poster_path
  );
}

function exit() {
  window.location.replace("/user/login");
}
