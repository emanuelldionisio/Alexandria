import Auth from "./lib/auth.js";
import API from './services/api.js';

const params = new URLSearchParams(window.location.search);

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id = params.get("id_user");

const form_cadastro = document.getElementById("form-cadastro");

form_cadastro.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form_cadastro);
    const data = Object.fromEntries(formData);

    if (!data) {
        alert("Preencha os campos corretamente, valeu!");
        return
    }
    
    const tipoprod = formData.elements['tipo'];

    if (tipoprod == 'livro'){
        API.create(`/usuario/${id}/${'livro'}/criarproduto`);
    } else {
        API.create(`/usuario/${id}/${'disco'}/criarproduto`);
    }

}




carregarCadProd(id)