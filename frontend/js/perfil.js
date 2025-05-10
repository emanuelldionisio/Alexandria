import { usuario } from './data/usuario.js';
import { segue } from './data/segue.js';
import { avaliacao_disco } from './data/avaliacao_disco.js';
import { avaliacao_livro } from './data/avaliacao_livro.js';
import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id_user = params.get("id_user");
const id = params.get("id_visitado");

function carregarPerfil() {
    menu_perfil(id);

    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `${usuario.find(obj => obj.cod == id).nome}`;

    //Adicionar avaliação
    let meus_discos = avaliacao_disco.filter(obj => obj.cod_usuario == id);
    let meus_livros = avaliacao_livro.filter(obj => obj.cod_usuario == id);

    let soma = 0, qt = 0;
    for (let i of avaliacao_disco) {
        if (meus_discos.find(obj => obj.id_prod == i.id_prod)) {
            soma += i.nota
            qt++;
        }
    }
    
    for (let i of avaliacao_livro) {
        if (meus_livros.find(obj => obj.id_prod == i.id_prod)) {
            soma += i.nota
            qt++;
        }
    }

    if (! qt) qt = 1;

    let container_avaliacao = document.getElementById("menu-usuario__avaliacao");
    container_avaliacao.insertAdjacentHTML('beforeend', `<p>${(soma/qt).toFixed(1)}</p>`);

    if (segue.find(obj => obj.seguido == id && obj.seguinte == id_user)) {
        let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");
        container_seguir.innerHTML = "Seguindo";
        container_seguir.style = "background-color: #595336; color: lightgrey";
    }
      
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function () {
    window.location.href = `inicial.html?id_user=${id_user}`;
}

carregarPerfil()