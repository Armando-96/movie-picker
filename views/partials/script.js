function like() {
    addInteraction("like");
}
function dislike() {
    addInteraction("dislike");
}

function end() {
    localStorage.clear();
    $("#body").load("/session/end");
}

function addInteraction(preference_choice) {
    movie_id = localStorage.getItem("movie_id");
    preference = preference_choice;
    $.get("/session/next" + '?' + 'preference=' + preference + '&' + 'movie_id=' + movie_id, function (data, status) {
        if (status == "success") {
            if (data.nonext) {
                $("#body").html('<h1>Non ci sono più film da mostrare</h1>');
            } else {
                localStorage.setItem("movie_id", data.id);
                $("#title").html(data.original_title);
                $("#rating").html(data.vote_average);
                $("#overview").html(data.overview);
                $("#poster").html("<img src=" + localStorage.getItem("prefix_poster_path") + data.poster_path + ">");
            }
        } else {
            alert("Errore nella richiesta");
        }
    });
}