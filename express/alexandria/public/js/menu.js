import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

const usuario = await fetch('data/usuario?id=1').then(response => response.json());

function carregarMenu() {
    menu_perfil(id);
    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `Olá, ${usuario.nome}`;
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function() {
    window.location.href = `inicial.html?id_user=${id}`;
}

carregarMenu()