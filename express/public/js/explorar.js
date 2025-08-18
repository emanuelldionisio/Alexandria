import { usuario } from './data/usuario.js';
import { palavra_usuario } from './data/palavra_usuario.js';
import { disco } from './data/disco.js';
import { livro } from './data/livro.js';




function barraDePesquisa() {
    let input = document.getElementById("search").value;
    input = input.toLowerCase();
    let resultados = [];

    

    // Atualizar a exibição dos resultados
    exibirResultados(resultados);
}








function carregarMenu() {
    //Vizualizar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;
}

export function irParaInicial() {
    window.location.href = `inicial.html?id_user=${id}`;
}
export function irParaPerfil() {
    window.location.href = `menu.html?id_user=${id}`;
}

window.irParaInicial = irParaInicial;
window.irParaPerfil = irParaPerfil;
carregarMenu()