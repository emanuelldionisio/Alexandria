import { usuario } from "./data/usuario.js";

const form = document.getElementById("form");

form.onsubmit 

= function() {
    event.preventDefault();
    let email_user = document.getElementById("login").value;
    let user = usuario.find(obj => obj.email == email_user);
    if (!user) {
        alert("Usuario não encontrado");
        return;
    }
    window.location.href = `inicial.html?id_user=${user.cod}`; // Redireciona para a página inicial com o id do usuário
}
