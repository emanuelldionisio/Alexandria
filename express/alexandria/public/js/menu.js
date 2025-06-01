import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

if (!id) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_user", 400);
}

const usuario = await fetch(`data/usuario?id_user=${id}`).then(response => response.json());

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