import Auth from "./lib/auth.js";
import API from './services/api.js';

const params = new URLSearchParams(window.location.search);

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id = Auth.getUserId()

const form_cadastro = document.getElementById("productForm");

(form_cadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form_cadastro);
    const obj = Object.fromEntries(fd)
    const data = JSON.stringify(obj);
    const nome = fd.get('title');
    const valor = fd.get('price');
    const cond = fd.get('condition');
    const des = fd.get('description');
    const aut_art = fd.get('author');
    const ed_grav = fd.get('publisher');
    const ano = fd.get('ano');
    const tipo = fd.get('category');

    const resultado = await API.create(`/usuario/${id}/criarproduto`, data);
    return resultado;

}    
))