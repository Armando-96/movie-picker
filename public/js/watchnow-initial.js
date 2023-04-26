function addInteraction(preference_choice) {
    preference = preference_choice;
    $.get({
        async: false,
        url: "/session/next" + '?' + 'preference=' + preference + '&' + 'movie_id=' + movie_id,
        success: function (data) {
            if (data.nonext) {
                $("#body").html('<h1>Non ci sono più film da mostrare</h1>');
            } else if (preference_choice == "selected") {
                $("#body").html('<h1>Film selezionato</h1>');//In attesa di sviluppo, da inserire una pagina di ringraziamenti o qualcosa del genere
                return;
            } else {
                movie_id = data.id;
                $("#title").html(data.title);
                $("#rating").html(data.vote_average);
                $("#overview").html(data.overview);
                $("#poster").attr("src", prefix_poster_path + data.poster_path);
            }
        },
        error: function () { alert("Errore nella richiesta"); }
    });
    if (preference_choice === "like") {
        $.get({
            async: false,
            url: "/watchnow/getNumLike",
            success: function (data) {
                json = JSON.parse(data);
                json.n_likes++;
                if (json.n_likes == 16) {
                    $.get("/watchnow/getLikeMovies", function (data, status) {
                        if (status == "success") {
                            $("#body").html("<h1>Film scelti:</h1><hr>" + data);//In attesa dello sviluppo del torneo
                        } else {
                            alert("Errore nella richiesta di getLikeMovies");
                        }
                    });
                    return;
                }
                $("#cumulator").text(json.n_likes + "/16");
            },
            error: function () {
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
