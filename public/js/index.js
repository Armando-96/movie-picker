$(document).ready(function () {
    const page = 1;
    const carouselItem =
        `<div class="carousel-item">
        <div class="row">
          <div class="col">
            <img src="img1.jpg" class="d-block w-100">
          </div>
          <div class="col">
            <img src="img2.jpg" class="d-block w-100">
          </div>
          <div class="col">
            <img src="img3.jpg" class="d-block w-100">
          </div>
          <div class="col">
            <img src="img4.jpg" class="d-block w-100">
          </div>
          <div class="col">
            <img src="img5.jpg" class="d-block w-100">
          </div>
        </div>
      </div>`;
    $.get({
        async: false,
        url: "/api/movies/trending?page=" + page,
        success: function (data) {
            const prefix_poster_path = data.prefix_poster_path;
            const caroselItemDaAggiungere = 3;
            for (let i = 0; i < caroselItemDaAggiungere; i++) {
                $('div.carousel-inner').append(carouselItem);
            }
            const moviePosters = $("div.col > img");
            for (let i = 0; i < moviePosters.length; i++) {
                if (data.results[i].poster_path != null)
                    $(moviePosters[i]).attr("src", prefix_poster_path + data.results[i].poster_path);
            }
            $('#carouselExample').carousel();
        },
        error: function (err) {
            console.log(err);
        },
    });
});