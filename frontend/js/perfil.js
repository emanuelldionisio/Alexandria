import { usuario } from './data/usuario.js';
import { segue } from './data/segue.js';
import { palavra_usuario } from './data/palavra_usuario.js';
import { disco } from './data/disco.js';
import { livro } from './data/livro.js';
import { avaliacao_disco } from './data/avaliacao_disco.js';
import { avaliacao_livro } from './data/avaliacao_livro.js';

function carregarPerfil() {
    let id_user = 2;
    let id = 1;
    
    const coresBootstrap = [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'dark'
    ];

    //Ajustar a quantidade de seguidores
    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = segue.filter(obj => obj["seguido"] == id).length + " seguidores";

    let container_segue = document.getElementById("menu-usuario__informacoes__seguindo");
    container_segue.innerHTML = segue.filter(obj => obj["seguinte"] == id).length + " seguindo";

    //Adicionar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;

    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `${usuario.find(obj => obj.cod == id).nome}`;

    //Adicionar as palavras chave
    let palavras = palavra_usuario.filter(obj => obj.usuario == id);
    let menu_palavras = document.getElementById("menu-palavras-chave__palavras-chave");
    for (let palavra of palavras) {
        let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
        menu_palavras.insertAdjacentHTML("beforeend", `
        <span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
            ${palavra.nome}
        </span>`);
    }

    //Adicionar os produtos
    let meus_discos = disco.filter(obj => obj.id_usuario == id);
    let meus_livros = livro.filter(obj => obj.id_usuario == id);
    let container_produtos = document.getElementById("menu-produtos__produtos");

    for (let i of meus_discos) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${i.nome}</h5>
                    <h6>R$ ${(i.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    for (let i of meus_livros) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${i.nome}</h5>
                    <h6>R$ ${(i.valor / 100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    //Adicionar avaliação
    let soma = 0, qt = 0;
    for (let i of avaliacao_disco) {
        if (meus_discos.find(obj => obj.id_prod = i.id_prod)) {
            soma += i.nota
            qt++;
        }
    }
    
    for (let i of avaliacao_livro) {
        if (meus_livros.find(obj => obj.id_prod = i.id_prod)) {
            soma += i.nota
            qt++;
        }
    }

    let container_avaliacao = document.getElementById("menu-usuario__avaliacao");
    container_avaliacao.insertAdjacentHTML('beforeend', `<p>${(soma/qt).toFixed(1)}</p>`);

    if (segue.find(obj => obj.seguido == id_user && obj.seguinte == id) != undefined) {
        let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");
        container_seguir.innerHTML = "Seguindo";
        container_seguir.style = "background-color: #595336; color: lightgrey";
    }
      
}

carregarPerfil()