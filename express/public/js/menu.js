import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

if (!id) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_user", 400);
}

const nome = await fetch(`data/usuarionome/${id}`).then(response => response.json());

function carregarMenu() {
    menu_perfil(id, "menu");
    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `Olá, ${nome}`;
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function() {
    window.location.href = `inicial.html?id_user=${id}`;
}

document.querySelector(".menu-produtos__produtos_adicionar").onclick = function() {
    window.location.href = `cadastro_produto.html?id_user=${id}`;
}

const botao_adicionar_palavra = document.querySelector(".menu-produtos__produtos_adicionar");


carregarMenu()