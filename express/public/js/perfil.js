import { menu_perfil } from './lib/menu_perfil.js';
import API from './services/api.js';
import Auth from './lib/auth.js';
import showToast from './lib/showToast.js';

if (! Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

let janela_aberta = false;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const me = Auth.getUserId();

if ((!id)) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
}

if (id == Auth.getUserId()) {
     window.location.href = `menu.html`;
}

const nome = await API.read(`/usuario/${id}/nome`);

if (nome.status === "error") {
    document.body.innerHTML = "<h1>Usuário não encontrado</h1>";
    throw new Error("Usuário não encontrado", 404);
}

let seguidores = await API.read(`/usuario/${id}/seguidores`);
const avaliacao = await API.read(`/usuario/${id}/mediaavaliacao`);

function renderizarSeguidores() {
    if (seguidores.find(user => user.seguinte == me)) {
        let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");
        container_seguir.innerHTML = "Seguindo";
        container_seguir.style = "background-color: #595336; color: lightgrey";
    } else {
        let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");
        container_seguir.innerHTML = "Seguir";
        container_seguir.style = "background-color: #44593E; color: white";
    } 
    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = seguidores.length + " seguidores";
}

function carregarPerfil() {
    menu_perfil(id, "perfil");

    //Adicionar o nome do user
    let mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `${nome}`;

    //Adicionar avaliação

    let container_avaliacao = document.getElementById("menu-usuario__avaliacao");
    container_avaliacao.insertAdjacentHTML('beforeend', `<p id="media-avaliacao">${avaliacao}</p>`);
    renderizarSeguidores();
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function () {
    window.location.href = `inicial.html`;
}

const botao_seguir = document.getElementById("menu-usuario__opcoes__seguir");

botao_seguir.onclick = async function () {
    let container_seguir = document.getElementById("menu-usuario__opcoes__seguir");
    
    if (botao_seguir.innerHTML === "Seguir") {
        const { status, message } = await API.create(`/usuario/${me}/seguidos`, { seguido: id });
        if (status != "ok") {
            showToast(message || "Erro ao seguir usuário");
            return;
        }
        seguidores.push({ seguinte: me, seguido: id });
        renderizarSeguidores();
    } else {
        await API.remove(`/usuario/${me}/seguidos`, { seguido: id });
        seguidores = seguidores.filter(user => user.seguinte != Auth.getUserId());
        renderizarSeguidores();
    }
    
}

const botao_avaliar = document.getElementById("menu-usuario__opcoes__avaliar");
botao_avaliar.onclick = function () {
    if (janela_aberta) return;
    janela_aberta = true;
    botao_avaliar.insertAdjacentHTML('beforebegin', `
        <form id="form-avaliacao">
            <button type="button" id="cancelar-avaliacao""> X </button>
            <label for="nota">Nota (1 a 5):</label>
            <div>
                <input type="number" id="nota" name="nota" class="form-control">
                <div class="invalid-feedback">Por favor, insira uma nota entre 1 e 5.</div>
            </div>
            <label for="descricao">Descrição:</label>
            <div>
                <textarea id="descricao" name="descricao" class="form-control"></textarea>
                <div class="invalid-feedback">Por favor, insira uma descrição.</div>
            </div>
            <button type="submit">Enviar Avaliação</button>
        </form>
    `);
    document.getElementById("cancelar-avaliacao").onclick = async function() {
        janela_aberta = false;
        document.getElementById("form-avaliacao").remove();
    };
    const form_avaliacao = document.getElementById("form-avaliacao");

    form_avaliacao.nota.oninput = function() {
        document.getElementById("nota").classList.remove("is-invalid");
    }

    form_avaliacao.descricao.oninput = function() {
        document.getElementById("descricao").classList.remove("is-invalid");
    }

    form_avaliacao.onsubmit = async function (event) {
        event.preventDefault();
        const nota = document.getElementById("nota").value;
        const descricao = document.getElementById("descricao").value;
        
        if (! nota || nota < 1 || nota > 5) {
            document.getElementById("nota").classList.add("is-invalid");
        }

        if (! descricao) {
            document.getElementById("descricao").classList.add("is-invalid");
        }

        if (!nota || nota < 1 || nota > 5 || !descricao) {
            return;
        }

        const { status, message } = await API.create(`/usuario/${me}/avaliacao`, { avaliado: id, nota: Number(nota), descricao });
        if (status != "ok") {
            showToast(message || "Erro ao enviar avaliação");
            return;
        }
        showToast("Avaliação enviada com sucesso");
        document.getElementById("form-avaliacao").remove();
        document.getElementById("media-avaliacao").innerHTML = await API.read(`/usuario/${id}/mediaavaliacao`);
        janela_aberta = false;
    };
}

const botao_denuncia = document.querySelector(".botao-denuncia");
botao_denuncia.onclick = function () {
    if (janela_aberta) return;
    janela_aberta = true;
    botao_denuncia.insertAdjacentHTML('beforebegin', `
        <form id="form-denuncia">
            <button type="button" id="cancelar-denuncia"> X </button>
            <div>
                <label for="descricao">Descrição:</label>
                <textarea id="descricao" name="descricao" class="form-control"></textarea>
                <div class="invalid-feedback">Por favor, insira uma descrição.</div>
            </div>
            <button type="submit">Enviar Denúncia</button>
        </form>
    `);
    document.getElementById("cancelar-denuncia").onclick = function() {
        janela_aberta = false;
        document.getElementById("form-denuncia").remove();
    };
    const form_denuncia = document.getElementById("form-denuncia");
    form_denuncia.descricao.oninput = function() {
        document.getElementById("descricao").classList.remove("is-invalid");
    }
    form_denuncia.onsubmit = async function (event) {
        event.preventDefault();
        const descricao = document.getElementById("descricao").value;
        janela_aberta = false;

        if (!descricao) {
            document.getElementById("descricao").classList.add("is-invalid");
            return;
        }

        document.getElementById("form-denuncia").remove();

        const { status, message } = await API.create(`/usuario/${me}/denuncia`, { denunciado: id, descricao });
        if (status != "ok") {
            showToast(message || "Erro ao enviar denúncia");
            return;
        }
        showToast("Denúncia enviada com sucesso");
    };
}

document.getElementById("menu-usuario__avaliacao").onclick = async function () {
    if (janela_aberta) return;
    janela_aberta = true;
    document.getElementById("menu-usuario__avaliacao").insertAdjacentHTML('beforebegin', `
        <div class="avaliacoes">
        <button type="button" id="cancelar-avaliacoes" style="align-self: flex-end;"> <i class="bi bi-x-lg"></i> </button>
        <h2>Avaliações</h2>
        <div class="avaliacoes-container">
        
        </div>
    </div>
    `);
    document.getElementById("cancelar-avaliacoes").onclick = function() {
        janela_aberta = false;
        document.querySelector(".avaliacoes").remove();
    };
    const container_avaliacao = document.querySelector(".avaliacoes-container");
    const avaliadores = await API.read(`/usuario/${id}/avaliadores`);
    for (const avaliador of avaliadores) {
        const nome = avaliador.avaliador.nome;
        container_avaliacao.insertAdjacentHTML(`beforeend`, `
            <div class="avaliacao-item">
                <img src="../imgs/usuario/${avaliador.avaliador.foto_perfil}" alt="Foto do usuário" onclick="window.location.href='perfil.html?id=${avaliador.avaliador.cod}'">
                <div class="avaliacao-conteudo">
                    <span class="avaliacao-nome">${nome}</span>
                    <span class="avaliacao-nota">⭐ ${avaliador.nota}</span>
                    <p class="avaliacao-texto">${avaliador.descricao}</p>
                </div>
            </div>
        `);
    }
}

carregarPerfil()