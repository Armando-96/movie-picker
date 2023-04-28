$("document").ready(function () {
  $.get("/watchnow/getLikeMovies", function (data, status) {
    if (status == "success") {
      localStorage.setItem("movies", JSON.parse(data));
    } else {
      alert("Errore nella richiesta di getLikeMovies");
    }
  });
});
