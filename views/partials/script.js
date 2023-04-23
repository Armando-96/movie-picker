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
    id_movie = localStorage.getItem("id_movie");
    preference = preference_choice;
    $.get("/session/next" + '?' + 'preference=' + preference + '&' + 'id_movie=' + id_movie, function (data, status) {
        if (status == "success") {
            if (data.nonext) {
                $("#body").html('<h1>Non ci sono più film da mostrare</h1>');
            } else {
                localStorage.setItem("id_movie", data.id);
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