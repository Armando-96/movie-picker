
function like() {
    localStorage.setItem("preference", "like");
    addInteraction();
}
function dislike() {
    localStorage.setItem("preference", "dislike");
    addInteraction();
}
function end() {
    localStorage.clear();
    //window.location.href = 'end';
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/session/end", false);
    xhr.send();
    document.getElementById("body").innerHTML = xhr.responseText;
}

function addInteraction() {
    id_movie = localStorage.getItem("id_movie");
    preference = localStorage.getItem("preference");
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = nextFilm;
    xhr.open("GET", "/session/next" + '?' + 'preference=' + preference + '&' + 'id_movie=' + id_movie, true);
    xhr.send();
}

function nextFilm(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        const film = JSON.parse(event.target.responseText);
        if (film.nonext) {
            document.getElementById("body").innerHTML = '<h1>Non ci sono più film da mostrare</h1>';
            return;
        }
        localStorage.setItem("id_movie", film.id);
        document.getElementById("title").innerHTML = film.original_title;
        document.getElementById("rating").innerHTML = film.vote_average;
        document.getElementById("overview").innerHTML = film.overview;
        document.getElementById("poster").innerHTML = "<img src=" + localStorage.getItem("prefix_poster_path") + film.poster_path + ">";
    }
}