import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id_user = params.get("id_user");
const id = params.get("id_visitado");

if ((!id || !id_user) || (id == id_user)) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
}

const usuario = await fetch(`data/usuario?id_user=${id}&modo='perfil'`).then(response => response.json());
const segue = await fetch(`data/segue?id_user=${id}&modo='perfil'`).then(response => response.json());
const meus_discos = await fetch(`data/avaliacao_disco?id_user=${id}&modo='perfil'`).then(response => response.json());
const meus_livros = await fetch(`data/avaliacao_livro?id_user=${id}&modo='perfil'`).then(response => response.json());
const avaliacao_disco = await fetch(`data/avaliacao_disco?id_user=${id}&modo='perfil'`).then(response => response.json());
const avaliacao_livro = await fetch(`data/avaliacao_livro?id_user=${id}&modo='perfil'`).then(response => response.json());

function carregarPerfil() {
    if ((! id || ! id_user) || (id == id_user)) {
        document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
        throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
    }

    menu_perfil(id);

    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `${usuario.nome}`;

    //Adicionar avaliação

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

const botao_seguir = document.getElementById("menu-usuario__opcoes__seguir");

botao_seguir.onclick = async function () {
    let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");

    if ((!id || !id_user) || (id == id_user)) {
        throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
    }
    
    if (botao_seguir.innerHTML === "Seguir") {
        await fetch(`data/segue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seguido: id, seguinte: id_user })
        });
    } else {
        await fetch(`data/segue`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seguido: id, seguinte: id_user })
        });   
    }
    window.location.reload();
}

carregarPerfil()