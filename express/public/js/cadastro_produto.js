import Auth from "./lib/auth.js";
import API from './services/api.js';

const params = new URLSearchParams(window.location.search);

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id = Auth.getUserId()

const form_cadastro = document.getElementById("productForm");

form_cadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form_cadastro);
    const obj = Object.fromEntries(fd)
    const data = JSON.stringify(obj);
    const nome = fd.get('nome');
    const valor = fd.get('valor');
    const cond = fd.get('condicao');
    const des = fd.get('descricao');
    const aut_art = fd.get('autor_artista');
    const ed_grav = fd.get('editora_gravadora');
    const gen = fd.get('genero');
    const pal = fd.get('chave');
    console.log(data, nome, valor, cond, des, aut_art, ed_grav, gen, pal);
})

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