import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id_user = params.get("id_user");
const id = params.get("id_visitado");

if ((!id || !id_user)) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
}

if (id == id_user) {
    window.location.href = `menu.html?id_user=${id_user}`;
}

const nome = await fetch(`data/usuarionome/${id}`).then(response => response.json());
const seguidores = await fetch(`data/seguidores/${id}`).then(response => response.json());
const avaliacao = await fetch(`data/mediaavaliacao/${id}`).then(response => response.json());

function carregarPerfil() {
    if ((! id || ! id_user) || (id == id_user)) {
        document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
        throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
    }

    menu_perfil(id);

    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `${nome}`;

    //Adicionar avaliação

    let container_avaliacao = document.getElementById("menu-usuario__avaliacao");
    container_avaliacao.insertAdjacentHTML('beforeend', `<p>${avaliacao}</p>`);

    if (seguidores.find(user => user == id_user)) {
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