if (logo != null) {
    //sostituisce il contenuto di #titleContainer con il logo
    $('#titleContainer').html(`<img src="${config.images.base_url + config.images.poster_sizes[3] + logo}" alt="logo" style="max-width: 33%;">`);
}

$('#rating').append(`<div class="progress-bar progress-bar-striped progress-bar-animated" role = "progressbar" style = "width: ${M.vote_average * 10}%;" aria-valuenow="${M.vote_average * 10}" aria-valuemin="0" aria-valuemax="100" > Rating: ${M.vote_average}</div>`);

if (M.vote_average < 3.3) {
    $('#rating').children().addClass('bg-danger');
} else if (M.vote_average < 6.6) {
    $('#rating').children().addClass('bg-info');
} else {
    $('#rating').children().addClass('bg-success');
}

if (K.length == 0) {
    $('#k-head').hide();
}

if (M.tagline == "") {
    $("#tagline").hide();
}

for (let i = 0; i < M.genres.length; i++) {
    $('#genres').append(`<div class="p-2 badge rounded-pill text-bg-secondary" style="font-size: 13px;">${M.genres[i].name}</div>`);
}

for (let i = 0; i < K.length; i++) {
    $('#keywords').append(`<div>#${K[i].name}</div>`);
}

for (let i = 0; i < C.length; i++) {
    $('#cast').append(
        `<div class="card flex-item" style="width: 10%; height: 10%; min-width: 110px;">
            <img src="${config.images.base_url + config.images.profile_sizes[1] + C[i].profile_path}" class="card-img-top" style="border-radius: 10px;">
            <div class="card-body">
                <h5 class="card-title">${C[i].character}</h5>
                <p class="card-text">${C[i].name}</p>
            </div>
        </div>`);
}

$('#cast > .flex-item:gt(5)').hide();

$('#castContainer > div > .show-more').click(function () {
    $('#cast > .flex-item:hidden:lt(10)').show();
    // se tutti gli elementi sono visibili, nascondi il pulsante "Mostra altri"
    if ($('#cast > .flex-item:hidden').length === 0) {
        $('#castContainer > div > .show-more').hide();
    }
});

for (let i = 0; i < V.length; i++) {
    $('#videos').append(
        `<div class="ratio ratio-16x9 flex-item" style="background-color: black; border-radius: 20px; width: 30%; min-width:300px"><iframe src="https://www.youtube.com/embed/${V[i].key}" style="border-radius: 20px;" allowfullscreen="allowfullscreen"></iframe></div>`
    );
}

$('#videos > .flex-item:gt(2)').hide();

$('#videosContainer > div > .show-more').click(function () {
    $('#videos > .flex-item:hidden:lt(3)').show();
    // se tutti gli elementi sono visibili, nascondi il pulsante "Mostra altri"
    if ($('#videos > .flex-item:hidden').length === 0) {
        $('#videosContainer > div > .show-more').hide();
    }
});

for (let i = 0; i < P.length; i++) {
    $('#posters').append(
        `<img src="${config.images.base_url + config.images.poster_sizes[3] + P[i].file_path}" style="width: 15%; min-width:100px">`
    );
}

$('#posters > img:gt(5)').hide();

$('#postersContainer > div > .show-more').click(function () {
    $('#posters > img:hidden:lt(6)').show();
    // se tutti gli elementi sono visibili, nascondi il pulsante "Mostra altri"
    if ($('#posters > img:hidden').length === 0) {
        $('#postersContainer > div > .show-more').hide();
    }
});

for (let i = 0; i < M.production_companies.length; i++) {
    if (M.production_companies[i].logo_path != null) {
        $('#productionCompanies').append(`<img src = "${config.images.base_url + config.images.logo_sizes[1] + M.production_companies[i].logo_path}" style = "border-radius: 10px; margin: 10px;" > `);
    } else {
        $('#productionCompanies').append(`<div class= "p-2 badge rounded-pill text-bg-secondary mx-1" style = "font-size: 13px;" > ${M.production_companies[i].name}</div>`);
    }
}

for (let i = 0; i < M.production_countries.length; i++) {
    $('#productionCountries').append(`<div class= "p-2 badge rounded-pill text-bg-secondary mx-1" style = "font-size: 13px;" > ${M.production_countries[i].name}</div>`);
}

for (let i = 0; i < similar.length; i++) {
    $('#similar').append(
        `
        <div class="card flex-item" style="width: 32%; min-width: 300px;">
            <img src="${config.images.base_url + config.images.poster_sizes[3] + similar[i].backdrop_path}" class="card-img-top">
            <div class="card-body ">
                <h3 class="card-title">${similar[i].title}</h3>
                <div class="card-text overflow-auto" style="max-height: 100px;">${similar[i].overview}</div>
                <div class="d-flex justify-content-center my-4" style="bottom: 0;">
                    <a style="position: absolute; bottom: 10px; font-size: 20px;" href="/api/movies/details?movie_id=${similar[i].id}" class="btn btn-outline-secondary">Go to details</a>
                </div>        
            </div>
        </div>
        `
    );

}
