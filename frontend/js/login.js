const form = document.getElementById("form");

form.onsubmit = function() {
    event.preventDefault();
    let id_user = document.getElementById("login").value;
    window.location.href = `inicial.html?id_user=${id_user}`;
}
