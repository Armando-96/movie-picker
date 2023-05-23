

$(document).ready(function () {
  //Permetto ai carousel item di avere overflow visibile quando il mouse è sopra per permettere all'animazione di essere vista correttamente
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

  //Definiamo delle costanti che useremo successivamente
  const page = 1;
  const limitWidth = 768;
  const carouselHeaderItemActive = `<div class="carousel-item active">`
  const carouselHeaderItem = `<div class="carousel-item">`
  const carouselItemMultiple =
    `   <div class="row">
          <div class="col">
            <img class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img class="d-block w-100 posterImage">
          </div>
          <div class="col">
            <img class="d-block w-100 posterImage">
          </div>
        </div>
      </div>`;
  const carouselItemSingle =
    `<img class="d-block w-100 posterImage">
      </div>`;

  //Chiamata ajax per ottenere i film in tendenza
  $.get({
    async: false,
    url: "/api/movies/trending?page=" + page,
    success: function (data) {
      //Aggiungiamo il video di sfondo ovvero il trailer del primo film di tendenza
      $("#bg-video").attr("src", `https://www.youtube.com/embed/${data.trailerKeyFirstMovie}?autoplay=1&loop=1&controls=0&showinfo=0&mute=1&playlist=${data.trailerKeyFirstMovie}`);
      //Prefisso da aggiungere all'attributo src per ottenere il poster dei film
      const prefix_poster_path = data.prefix_poster_path;

      //Se la larghezza della finestra è sotto una certa soglia, allora mostriamo un solo poster per volta altrimenti ne mostriamo 5
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
      //Aggiungiamo i poster dei film agli elementi carousel-item
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
      //Aggiungo un event listener per poter permettere di cambiare il carosello quando la finestra viene ridimensionata (per esemio su mobile quando si gira il telefono)
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

  //Tasto per mostrare i generi nel form di ricerca
  $("#show-genres").click(function () {
    if (!$("#choseGenres").find("input[type=checkbox]").length) {//Controlla se i generi siano già stati caricati se non lo sono fa una chiamata ajax per ottenerli
      $.get("/api/movies/search/getGenres", function (data, status) {
        if (status == "success") {
          $("#choseContainer").animate({ width: '60%', height: '100%' });
          $("#choseGenres").empty();
          setTimeout(function () {
            $("#choseGenres").append("<h5 style='margin-bottom: 50px;'>Genres</h5>");
            for (let i = 0; i < data.length; i++) {
              let checkbox =
                `
                <div class="genre-checkbox">
                  <input class="form-check-input" type="checkbox" value="${data[i].genre_id}" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                  ${data[i].genre_name}
                  </label>
                </div>
                `;
              $("#choseGenres").append(checkbox);
            }
            $("#choseGenres").css("border", "2px solid black");
            $("#choseGenres").css("padding", "40px");
            $("#choseGenres").css("display", "block");
          }, 500);

        } else {
          alert("Error");
        }
      });

      $("#show-genres").html("Hide genres &#8595;");

    } else if ($("#choseGenres").css("display") == "none") {//Se i generi sono già stati caricati allora fa un altro controllo, se sono nascosti li mostra altrimenti li nasconde

      $("#choseContainer").animate({ width: '60%', height: '100%' });
      $("#show-genres").html("Hide genres &#8595;");
      setTimeout(function () {
        $("#choseGenres").fadeIn("slow");
      }, 500);

    } else {

      $("#show-genres").html("Select genres &#8594;");
      $("#choseGenres").fadeOut("slow");
      //Se anche gli attori sono nascosti allora centro il form di ricerca con un'animazione
      if ($("#chosePeople").css("display") == "none") {
        setTimeout(function () {
          $("#choseContainer").animate({ width: '0px' });
        }, 500);
      }
    }

  });
  //Tasto per mostrare l'input per la ricerca degli attori
  $("#show-people").click(function () {
    if ($("#chosePeople").css("display") == "none") {

      $("#choseContainer").animate({ width: '60%', height: '100%' });
      $("#show-people").html("Hide actors &#8595;");
      setTimeout(function () {
        $("#chosePeople").fadeIn("slow");
      }, 500);

    } else {
      if ($(".person").find("input[type=checkbox]:checked").length == 0)
        $("#show-people").html("Select an actor &#8594;");
      else
        $("#show-people").html("Actor selected: " + $("#searchPeopleResults").find("input[type=checkbox]:checked").attr("name"));

      setTimeout(function () { $("#chosePeople").fadeOut("slow"); }, 100);

      if ($("#choseGenres").css("display") == "none" || !$("#choseGenres").find("input[type=checkbox]").length) {

        let currentPositionDown = $(window).scrollTop() + $(window).height();
        let formSearchPosition = $('#myFormSearch').offset().top + $('#myFormSearch').outerHeight();
        let delta = currentPositionDown - formSearchPosition;
        if (delta > 0) {
          $('html, body').animate({
            scrollTop: currentPositionDown - delta - $(window).height() + 5
          }, 10);
        }

        setTimeout(function () {
          $("#choseContainer").animate({ width: '0px' });
        }, 500);

      }

    }
  });

  $("#personSearchButton").click(function () {
    let query = '"' + $("#personSearchInput").val() + '"';
    if (query) {
      //Chiamata ajax per ottenere gli attori con il nome inserito
      $.get("/api/movies/search/person?query=" + query, function (data, status) {
        if (status == "success") {
          $("#searchPeopleResults").empty();
          for (let i = 0; i < data.people.length; i++) {
            let profile_path = data.people[i].profile_path ? data.prefix_profile_path + data.people[i].profile_path : "/images/image-placeholder.png";
            let person =
              `
              <div class="person">
                <img class="searchPeopleImage" src="${profile_path}" alt="person image">
                <p>${data.people[i].name}</p>
                <input type="checkbox" class="inputPerson" name="${data.people[i].name}" value="${data.people[i].id}" style="display: none;" >
              </div>
              `;
            $("#searchPeopleResults").append(person);
          }
          //Click su un attore per selezionarlo e inserirlo nella ricerca
          $(".person").click(function () {
            $(this).find("input[type=checkbox]").prop("checked", !$(this).find("input[type=checkbox]").prop("checked"));

            setTimeout(function () { $("#chosePeople").fadeOut("slow"); }, 100);

            if ($("#choseGenres").css("display") == "none" || !$("#choseGenres").find("input[type=checkbox]").length) {
              setTimeout(function () {
                $("#choseContainer").animate({ width: '0px' });
              }, 500);
            }
            //Inseriamo un animazione per non far scattare la pagina verso l'alto
            let currentPositionDown = $(window).scrollTop() + $(window).height();
            let formSearchPosition = $('#myFormSearch').offset().top + $('#myFormSearch').outerHeight();
            let delta = currentPositionDown - formSearchPosition;
            if (delta > 0) {
              $('html, body').animate({
                scrollTop: currentPositionDown - delta - $(window).height() + 5
              }, 10);
            }
            //Modifichiamo l'estetica del tasto a seconda sia stato selezionato un attore oppure no
            let person = $("#searchPeopleResults").find("input[type=checkbox]:checked");
            $("#with_people").val(person.val());
            if (person.attr("name"))
              $("#show-people").text("Actor selected: " + person.attr("name"));
            else
              $("#show-people").html("Select people &#8594;");

          });

        } else {
          alert("Error");
        }
      });
    }
  });



  $("#myFormSearch").submit(function (event) {
    event.preventDefault();
    //Costruiamo la query da passare al server
    let formData = $(this).serializeArray().filter(function (e) { return e.value != ""; });//Crea un array di oggetti con i campi del form
    formData = "?" + $.param(formData); //Crea una stringa con i campi del form separati da & per la query
    let genresCheckbox = $("#choseGenres");
    let genres = genresCheckbox.find("input[type=checkbox]:checked"); //Array di checkbox selezionati
    let person_id = $("#with_people").val();
    if (person_id) formData += "&with_people=" + person_id;
    if (genres.length > 0) {
      let genresString = genres[0].value;
      for (let i = 1; i < genres.length; i++) {
        genresString += "," + genres[i].value;
      }
      formData += "&with_genres=" + genresString;
    }
    //Chiamata ajax per ottenere i film con i parametri inseriti
    $.get("/api/movies/search" + formData, function (data, status) {
      if (status == "success") {
        $("#headTitle").empty();
        $('#headTitle')
          .prepend(`<h2 class="text-center">Movies found</h2>`);

        $("#moviesResults").empty();
        for (let i = 0; i < data.results.length; i++) {
          let poster = data.results[i].poster_path ? data.prefix_poster_path + data.results[i].poster_path : "/images/image-placeholder.png";
          $('#moviesResults').append(
            `
            <div class="flex-item movie-found">
              <img src="${poster}" class="card-img-top">
              <div class="movie-desc">
                <div class="movie-title" style="font-size: 100%;height: 30px;">${data.results[i].title}</div>
              </div>
              <div class="d-flex justify-content-center my-4" style="bottom: 0;">
                <a style="bottom: 10px; font-size: 100%;" href="/api/movies/details?movie_id=${data.results[i].id}" class="btn btn-outline-secondary">Details</a>
              </div>
            </div>
            `
          );
        }

        $('html, body').animate({
          scrollTop: $("#searchResults").offset().top - 10
        }, 10);

      } else {
        alert("Error");
      }
    });
  });

  //Ricerca film per nome
  $("#searchButtonByName").click(function () {
    let movie_name = $("#searchInputByName").val();
    if (!movie_name) return;

    let request = "/api/movies/home/movieByName?movie_name=" + movie_name;
    //Chiamata ajax per ottenere i film con il nome inserito
    $.get(request, function (data, status) {
      if (status != "success") { alert("Error"); return; }

      $("#headTitle").empty();
      $('#headTitle')
        .prepend(`<h2 class="text-center">Movies found</h2>`);

      $("#moviesResults").empty();
      for (let i = 0; i < data.movie.length; i++) {
        let poster = data.movie[i].poster_path ? data.prefix_poster_path + data.movie[i].poster_path : "/images/image-placeholder.png";
        $('#moviesResults').append(
          `
            <div class="flex-item movie-found">
              <img src="${poster}" class="card-img-top">
              <div class="movie-desc">
                <div class="movie-title" style="font-size: 100%;height: 30px;">${data.movie[i].title}</div>
              </div>
              <div class="d-flex justify-content-center my-4" style="bottom: 0;">
                <a style="bottom: 10px; font-size: 100%;" href="/api/movies/details?movie_id=${data.movie[i].id}" class="btn btn-outline-secondary">Details</a>
              </div>
            </div>
            `
        );
      }

      $('html, body').animate({
        scrollTop: $("#searchResults").offset().top - 10
      }, 10);

    });

  });

});

