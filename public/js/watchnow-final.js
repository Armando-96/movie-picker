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

//let user_id = getCookieValue("user_id").toString();

let inFav = checkFavourite();
$(".favourite-button").click(toggleFavourite);

function checkFavourite() {
  $.ajax({
    url: "/profile/checkFav",
    method: "GET",
    data: { user_id: user_id, movie_id: movie_id },
    success: function (response) {
      if (response === "true") {
        $(".favourite-button")
          .removeClass("bi-heart")
          .addClass("bi-heart-fill");
        return true;
      } else {
        $(".favourite-button")
          .removeClass("bi-heart-fill")
          .addClass("bi-heart");
        return false;
      }
    },
  });
}

function toggleFavourite() {
  if (inFav) {
    $.ajax({
      url: "/profile/removeFav",
      method: "GET",
      data: { user_id: user_id, movie_id: movie_id },
      success: function (response) {
        $(".favourite-button")
          .removeClass("bi-heart-fill")
          .addClass("bi-heart");
        inFav = false;
      },
      error: function (xhr, status, error) {
        alert("Error removing this film to your favourites");
      },
    });
  } else {
    $.ajax({
      url: "/profile/addFav",
      method: "GET",
      data: { user_id: user_id, movie_id: movie_id },
      success: function (response) {
        $(".favourite-button")
          .removeClass("bi-heart")
          .addClass("bi-heart-fill");
        inFav = true;
      },
      error: function (xhr, status, error) {
        alert("Error adding this film to your favourites");
      },
    });
  }
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
