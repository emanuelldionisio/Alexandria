import Auth from "./lib/auth.js";
import API from './services/api.js';

const params = new URLSearchParams(window.location.search);

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id = Auth.getUserId()

const form_cadastro = document.getElementById("productForm");
form_cadastro.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form_cadastro);
    const data = Object.fromEntries(formData);

    if (!data) {
        alert("Preencha os campos corretamente, valeu!");
        return
    }
    
    const tipoprod = data['tipo'];

    if (tipoprod == 'livro'){
        API.create(`/usuario/${id}/${'livro'}/${data}/criarproduto`);
    } else {
        API.create(`/usuario/${id}/${'disco'}/${data}/criarproduto`);
    }

}