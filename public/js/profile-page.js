
$(document).ready(function () {
    for (let i = 0; i < favourites.length; i++) {
        $("#containerFavourites").append(`
            <div class="container-card m-3">
                <div class="card">
                    <div class="row">
                        <div class="container-img">
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

    let genre_names = [];
    let genre_quantities = [];
    let sum_quantities = 0;
    for (let i = 0; i < genreStatics.length; i++) {
        sum_quantities += Number(genreStatics[i].quantity);
    }
    for (let i = 0; i < genreStatics.length; i++) {
        genre_names.push(genreStatics[i].genre_name);
        genre_quantities.push(((Number(genreStatics[i].quantity) / sum_quantities) * 100).toFixed(2));
    }

    let ctx = $('#myChart')[0].getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: genre_names,
            datasets: [{
                label: '%',
                data: genre_quantities,
                backgroundColor: [
                    'red',
                    'blue',
                    'yellow',
                    'green',
                    'purple',
                    'orange',
                    'pink',
                    'brown',
                    'grey',
                    'black',
                    'cyan',
                    'magenta',
                    'lime',
                    'teal',
                    'lavender',
                    'maroon',
                    'navy',
                    'olive',
                    'silver'
                ],
                borderColor: [
                    'red',
                    'blue',
                    'yellow',
                    'green',
                    'purple',
                    'orange',
                    'pink',
                    'brown',
                    'grey',
                    'black',
                    'cyan',
                    'magenta',
                    'lime',
                    'teal',
                    'lavender',
                    'maroon',
                    'navy',
                    'olive',
                    'silver'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            legend: {
                position: 'left',
                align: 'start',
                labels: {
                    fontSize: 20,
                    fontColor: 'white',
                },

            },
        }
    });

    if (window.innerWidth < 768) {
        myChart.options.legend.position = 'bottom';
        myChart.options.legend.align = 'center';
        myChart.options.legend.labels.fontSize = 16;
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth < 768) {
            myChart.options.legend.position = 'bottom';
            myChart.options.legend.align = 'center';
            myChart.options.legend.labels.fontSize = 14;
        } else {
            myChart.options.legend.position = 'left';
            myChart.options.legend.align = 'start';
            myChart.options.legend.labels.fontSize = 20;
        }
    });


    for (let i = 0; i < mostLikedActors.length; i++) {
        let profile_path = mostLikedActors[i].profile_path ? config.images.base_url + config.images.profile_sizes[1] + mostLikedActors[i].profile_path : "/images/image-placeholder.png";
        $("#containerLikedActors").append(`
            <div class="card flex-item" style="width: 10%; height: 10%; min-width: 110px;">
                <img src="${profile_path}" class="card-img-top" style="border-radius: 10px;">
                <div class="card-body">
                    <h5 class="card-title">${mostLikedActors[i].name}</h5>
                    <p class="card-text">In ${mostLikedActors[i].count} liked movies</p>
                </div>
            </div>
            `);
    }

});