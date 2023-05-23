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
      movie_id,
    success: function (data) {
      if (data.nonext) {
        $("#body").html("<h1>Non ci sono più film da mostrare</h1>");
      } else if (preference_choice == "selected") {
        redirectToSelected(movie_id); //In attesa di sviluppo, da inserire una pagina di ringraziamenti o qualcosa del genere
        return;
      } else {
        movie_id = data.id;
        $("#title").html(data.title);
        $("#rating").html(data.vote_average);
        $("#overview").html(data.overview);
        $("#poster").attr("src", prefix_poster_path + data.poster_path);
      }
    },
    error: function () {
      alert("Errore nella richiesta");
    },
  });
}

$("#dislike").click(function () {
  addInteraction("dislike");
});

$("#like").click(function () {
  addInteraction("like");
});

$("#end").click(function () {
  addInteraction("selected");
});

function exit() {
  window.location.replace("/user/login");
}

function redirectToSelected(movie_id) {
  window.location.replace("/discovery/final?movie=" + movie_id);
}
