
$(document).ready(function () {
    for (let i = 0; i < favourites.length; i++) {
        $("#containerFavourites").append(`
            <div class="container-card">
                <div class="card m-3">
                    <div class="row g-0">
                        <div class="col-md-4 container-img">
                            <img src="${config.images.base_url + config.images.poster_sizes[3] + favourites[i].poster_path}" class="img-fluid rounded-start poster-img" alt="Movie image">
                        </div>
                        <div class="col">
                            <div class="card-body">
                                <h5 class="card-title">${favourites[i].title}</h5>
                                <p class="card-text">${favourites[i].overview}</p>
                                <a href="/api/movies/details?movie_id=${favourites[i].movie_id}" class="btn btn-outline-secondary">Go to details</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);
    }
});