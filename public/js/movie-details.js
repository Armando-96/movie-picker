if (logo != null) {
    //sostituisce il contenuto di #titleContainer con il logo
    $('#titleContainer').html(`<img src="${config.images.base_url + config.images.poster_sizes[3] + logo}" alt="logo" style="max-width: 33%; max-height: 200px">`);
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
    let profile_path = C[i].profile_path ? config.images.base_url + config.images.profile_sizes[1] + C[i].profile_path : "/images/image-placeholder.png";
    $('#cast').append(
        `<div class="card flex-item" style="width: 10%; height: 10%; min-width: 110px;">
            <img src="${profile_path}" class="card-img-top" style="border-radius: 10px;">
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
        <div class="card flex-item" style="width: 32%; min-width: 300px; height:auto;">
            <img src="${config.images.base_url + config.images.poster_sizes[3] + similar[i].backdrop_path}" class="card-img-top">
            <div class="card-body">
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

$(document).ready(function () {
    if (user_id) {
        if (!favourite) {
            $("#addFav").html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16" color="white">
                    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                </svg>
            `);
        } else {
            $("#addFav").html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16" color="red">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                </svg>
            `);
        }

        $("#addFav").click(function () {
            if (!favourite) {
                $.get(`/profile/addFav?user_id=${user_id}&movie_id=${M.id}`, function (data, status) {
                    if (status == "success") {
                        $("#addFav").html(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16" color="red">
                                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                            </svg>
                        `);

                    } else alert("Error");
                });
                favourite = true;
            } else {
                $.get(`/profile/removeFav?user_id=${user_id}&movie_id=${M.id}`, function (data, status) {
                    if (status == "success") {
                        $("#addFav").html(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16" color="white">
                                <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                            </svg>
                        `);
                    } else alert("Error");
                });
                favourite = false;
            }
        });
    }
});
