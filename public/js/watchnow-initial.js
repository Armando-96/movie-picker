function addInteraction(preference_choice) {
    movie_id = localStorage.getItem("movie_id");
    preference = preference_choice;
    $.get("/session/next" + '?' + 'preference=' + preference + '&' + 'movie_id=' + movie_id, function (data, status) {
        if (status == "success") {
            if (data.nonext) {
                $("#body").html('<h1>Non ci sono più film da mostrare</h1>');
            } else if (preference_choice == "selected") {
                $("#body").html('<h1>Film selezionato</h1>');//In attesa di sviluppo, da inserire una pagina di ringraziamenti o qualcosa del genere
                return;
            } else {
                localStorage.setItem("movie_id", data.id);
                $("#title").html(data.original_title);
                $("#rating").html(data.vote_average);
                $("#overview").html(data.overview);
                $("#poster").attr("src", localStorage.getItem("prefix_poster_path") + data.poster_path);
            }
        } else {
            alert("Errore nella richiesta");
        }
    });
    if (preference_choice === "like") {
        $.get("/watchnow/getNumLike", function (data, status) {
            if (status == "success") {
                json = JSON.parse(data);
                json.n_likes++;
                if (json.n_likes == 16) {
                    $("#body").html('<h1>Hai raggiunto 16 film piaciuti -> Torneo!</h1>');//In attesa dello sviluppo del torneo
                    return;
                }
                $("#cumulator").text(json.n_likes + "/16");
            } else {
                alert("Errore nella richiesta di getNumLike");
            }
        });
    }
}

$("#dislike").click(function () {
    addInteraction("dislike");
});

$("#like").click(function () {
    addInteraction("like");
});

//Da modificare il database oppure la funzione addInteraction
$("#select").click(function () {
    addInteraction("selected");
});
