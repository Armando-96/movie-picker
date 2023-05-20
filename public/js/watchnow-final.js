$("body").addClass("bg-success");
$(".card-reveal").hide();
$(".bi-share-fill").click(function () {
  $(".card-reveal").slideDown("150");
});
$(".bi-x-lg").click(function () {
  $(".card-reveal").slideUp("150");
});
element = document.querySelector(".final-title");
party.confetti(element, {
  debug: false,
  gravity: 800,
  zIndex: 99999,
  shapes: ["square", "circle", "roundedRectangle"],
  count: party.variation.range(20, 40),
});

let user_id = getCookieValue("user_id");
let movie_id = localStorage.getItem("movie_id");

$(".favourite-button").click(addFavourite);

function addFavourite() {
  $.ajax({
    url: "/profile/addFav",
    method: "GET",
    data: { user_id: user_id, movie_id: movie_id },
    success: function (response) {
      $(".favourite-button").removeClass("bi-heart").addClass("bi-heart-fill");
    },
    error: function (xhr, status, error) {
      alert("Error adding this film to your favourites");
    },
  });
}

function getCookieValue(cookieName) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split("=");
    if (cookie[0] === cookieName) {
      return decodeURIComponent(cookie[1]);
    }
  }
  return null; // Cookie non trovato
}
