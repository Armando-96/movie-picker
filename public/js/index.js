$(document).ready(function () {

  let carouselInner = $(".carousel-inner");
  carouselInner.hover(function () {
    $(this).css("overflow", "visible");
  },
    function () {
      const delay = 200; // milliseconds
      setTimeout(function () {
        carouselInner.css('overflow', 'hidden');
      }, delay);
    });

  const page = 1;
  const limitWidth = 768;
  const carouselHeaderItemActive = `<div class="carousel-item active">`
  const carouselHeaderItem = `<div class="carousel-item">`
  const carouselItemMultiple =
    `   <div class="row">
          <div class="col">
            <img src="img1.jpg" class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img src="img2.jpg" class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img src="img3.jpg" class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img src="img4.jpg" class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img src="img5.jpg" class="d-block w-100 posterImage">
          </div>
        </div>
      </div>`;
  const carouselItemSingle =
    `<img src="img1.jpg" class="d-block w-100 posterImage">
      </div>`;

  $.get({
    async: false,
    url: "/api/movies/trending?page=" + page,
    success: function (data) {
      const prefix_poster_path = data.prefix_poster_path;

      if (window.innerWidth < limitWidth) {
        $("#carousel").attr("class", "carousel slide d-flex justify-content-center container")
        $("#carousel").attr("style", "max-width: 450px;")
        const caroselItemDaAggiungere = 20;
        for (let i = 0; i < caroselItemDaAggiungere; i++) {
          if (i == 0) {
            $('div.carousel-inner').append(carouselHeaderItemActive + carouselItemSingle);
          } else {
            $('div.carousel-inner').append(carouselHeaderItem + carouselItemSingle);
          }
        }
      } else {
        const caroselItemDaAggiungere = 4;
        for (let i = 0; i < caroselItemDaAggiungere; i++) {
          if (i == 0) {
            $('div.carousel-inner').append(carouselHeaderItemActive + carouselItemMultiple);
          } else {
            $('div.carousel-inner').append(carouselHeaderItem + carouselItemMultiple);
          }
        }
      }

      const moviePosters = $(".posterImage");
      for (let i = 0; i < moviePosters.length; i++) {
        if (data.results[i].poster_path != null) {
          $(moviePosters[i]).attr("src", prefix_poster_path + data.results[i].poster_path);
          $(moviePosters[i]).click(function () {
            window.location.href = "/api/movies/details?movie_id=" + data.results[i].id;
          }
          );
        }
      }

      window.addEventListener('resize', function () {
        if (window.innerWidth < limitWidth) {
          $('div.carousel-inner').empty();//Elimina tutti i nodi figli diretti di carousel-inner
          $("#carousel").attr("class", "carousel slide d-flex justify-content-center container")
          $("#carousel").attr("style", "max-width: 450px;")
          const caroselItemDaAggiungere = 20;
          for (let i = 0; i < caroselItemDaAggiungere; i++) {
            if (i == 0) {
              $('div.carousel-inner').append(carouselHeaderItemActive + carouselItemSingle);
            } else {
              $('div.carousel-inner').append(carouselHeaderItem + carouselItemSingle);
            }
          }
        } else {
          $('div.carousel-inner').empty();//Elimina tutti i nodi figli diretti di carousel-inner
          $("#carousel").attr("class", "carousel slide d-flex justify-content-center")
          $("#carousel").attr("style", "max-width: 100%;")
          const caroselItemDaAggiungere = 4;
          for (let i = 0; i < caroselItemDaAggiungere; i++) {
            if (i == 0) {
              $('div.carousel-inner').append(carouselHeaderItemActive + carouselItemMultiple);
            } else {
              $('div.carousel-inner').append(carouselHeaderItem + carouselItemMultiple);
            }
          }
        }
        const moviePosters = $(".posterImage");
        for (let i = 0; i < moviePosters.length; i++) {
          if (data.results[i].poster_path != null) {
            $(moviePosters[i]).attr("src", prefix_poster_path + data.results[i].poster_path);
            $(moviePosters[i]).click(function () {
              window.location.href = "/api/movies/details?movie_id=" + data.results[i].id;
            }
            );
          }
        }

      });
      $('#carousel').carousel();
    },
    error: function (err) {
      console.log(err);
    },
  });


  $("#show-genres").click(function () {

    if ($("#show-genres").html() == "Select genres →") {

      $.get("/api/movies/search/getGenres", function (data, status) {
        if (status == "success") {
          $("#choseGenresPeople").animate({ width: '60%' });
          $("#choseGenresPeople").empty();
          setTimeout(function () {
            $("#choseGenresPeople").css("display", "block");
            //Aggiungere un titolo tipo scegli i generi
            for (let i = 0; i < data.length; i++) {
              let checkbox =
                `
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                ${data[i].genre_name}
                </label>
                `;
              $("#choseGenresPeople").append(checkbox);
            }
          }, 500);

        } else {
          alert("Error");
        }
      });

      $("#show-genres").html("Hide genres &#8595;");

    } else {
      $("#show-genres").html("Select genres &#8594;");
      $("#choseGenresPeople").fadeToggle("slow");
    }
  });



  $("#myFormSearch").submit(function (event) {
    event.preventDefault();
    let formData = $(this).serializeArray().filter(function (e) { return e.value != ""; });
    formData = "?" + $.param(formData);
    alert(formData);
    $.get("/api/movies/search" + formData, function (data, status) {
      if (status == "success") {
        $("#debugDiv").text(JSON.stringify(data));
      } else {
        alert("Error");
      }
    });
  });

});