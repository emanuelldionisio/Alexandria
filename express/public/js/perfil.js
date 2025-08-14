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

    menu_perfil(id, "perfil");

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

const botao_avaliar = document.getElementById("menu-usuario__opcoes__avaliar");
botao_avaliar.onclick = function () {
    botao_avaliar.insertAdjacentHTML('beforebegin', `
        <form id="form-avaliacao">
            <button type="button" id="cancelar-avaliacao" onclick="window.location.reload()"> X </button>
            <label for="nota">Nota (1 a 5):</label>
            <input type="number" id="nota" name="nota" min="1" max="5" required>
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" name="descricao"></textarea>
            <button type="submit">Enviar Avaliação</button>
        </form>
    `);
    const form_avaliacao = document.getElementById("form-avaliacao");
    form_avaliacao.onsubmit = async function (event) {
        event.preventDefault();
        const nota = document.getElementById("nota").value;
        const descricao = document.getElementById("descricao").value;

        if (! nota || ! descricao) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        await fetch(`data/avaliar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cod_avaliador: id_user, cod_avaliado: id, nota: parseInt(nota), descricao })
        });
        window.location.reload();
    };
}

const botao_denuncia = document.querySelector(".botao-denuncia");
botao_denuncia.onclick = function () {
    botao_denuncia.insertAdjacentHTML('beforebegin', `
        <form id="form-denuncia">
            <button type="button" id="cancelar-denuncia" onclick="window.location.reload()"> X </button>
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" name="descricao"></textarea>
            <button type="submit">Enviar Denúncia</button>
        </form>
    `);
    const form_denuncia = document.getElementById("form-denuncia");
    form_denuncia.onsubmit = async function (event) {
        event.preventDefault();
        const descricao = document.getElementById("descricao").value;

        if (!descricao) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        await fetch(`data/denunciar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ denunciante: id_user, denunciado: id, descricao })
        });
        window.location.reload();
    };
}

carregarPerfil()