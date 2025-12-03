import Auth from './lib/auth.js';
import API from './services/api.js';
import { menu_perfil } from './lib/menu_perfil.js';
import { renderizarPalavras } from './lib/renderizarPalavras.js';
import api from './services/api.js';
import showToast from './lib/showToast.js';

let janela_aberta = false;

const coresBootstrap = [
    'primary', 'secondary', 'success', 'danger',
    'warning', 'info', 'dark'
];

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const nome = await API.read(`/usuario/me/nome`);

function carregarMenu() {
    menu_perfil("me" ,"menu");
    const mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `Olá, ${nome}`;
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function() {
    window.location.href = `inicial.html`;
}

document.querySelector(".menu-produtos__produtos_adicionar").onclick = function() {
    window.location.href = `cadastro_produto.html?id_user=${'me'}`;
}

const botao_adicionar_palavra = document.querySelector("#botao_adicionar")
let adicionando_palavra = false;

botao_adicionar_palavra.onclick = function() {
    if (adicionando_palavra) {
        document.getElementById("input_palavra").remove();
        adicionando_palavra = false;
        return;
    }
    let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
    botao_adicionar_palavra.insertAdjacentHTML('beforebegin', `
        <div class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra position-relative" id="input_palavra">
        <input type="text" class="form-control">
        <div class="invalid-feedback position-absolute start-0 top-100 mt-1"></div>
    </div>
    `);
    adicionando_palavra = true;
}

document.addEventListener('input', function (e) {
    if (e.target.matches('.menu-palavras-chave__palavra input')) {
        document.querySelector("#input_palavra input").classList.remove("is-invalid");
        e.target.style.width = (e.target.value.length + 2) + 'ch';
    }
});

document.getElementById("editar_nome").onclick = function () {
    const nomeUsuario = document.getElementById("menu-usuario__mensagem");
    nomeUsuario.style.position = 'relative';
    nomeUsuario.innerHTML = `Olá, <input type="text" id="nome_usuario_input" class="d-inline-block form-control" value="${nome}"> <div class="invalid-feedback position-absolute start-0 top-100 mt-1"></div>`;
    const inputNome = document.getElementById("nome_usuario_input");
    inputNome.style.width = (inputNome.value.length + 2) + 'ch';
    inputNome.focus();
    inputNome.addEventListener('input', function () {
        inputNome.style.width = (inputNome.value.length + 2) + 'ch';
    });

    inputNome.addEventListener('keydown', async function (e) {
        const inputNome = document.getElementById("nome_usuario_input");
        const novoNome = inputNome.value.trim();
        const feedbackElement = document.querySelector("#nome_usuario_input + .invalid-feedback");
        if (e.key === 'Enter') {
            if (!novoNome) {
                inputNome.classList.add("is-invalid");
                feedbackElement.textContent = "O nome não pode ser vazio.";
                inputNome.style.width = (feedbackElement.textContent.length - 10) + 'ch';
                return;
            }

            if (novoNome.length > 128 || novoNome.length < 2) {
                inputNome.setCustomValidity("O nome deve ter entre 2 e 128 caracteres.");
                feedbackElement.textContent = "O nome deve ter entre 2 e 128 caracteres.";
                inputNome.classList.add("is-invalid");
                inputNome.style.width = (feedbackElement.textContent.length - 23) + 'ch';
                return;
            }

            const { status, message } = await API.update(`/usuario/me/nome`, { nome: novoNome });
            if (status != "ok") {
                showToast(message || "Erro ao atualizar nome");
                return;
            }
            nomeUsuario.innerHTML = `Olá, ${novoNome}`;
        } else {
            inputNome.classList.remove("is-invalid");
            feedbackElement.textContent = "";
        }
    });

}

document.addEventListener('keydown', async function (e) {
    
    if ( !e.target.matches('.menu-palavras-chave__palavra input') 
        ||  e.key !== 'Enter') return;
    
    e.preventDefault();

    const nomePalavra = e.target.value.trim().toLowerCase();
    const inputElement = document.querySelector("#input_palavra input");
    const feedbackElement = document.querySelector("#input_palavra .invalid-feedback");

    if (! nomePalavra) {
        inputElement.classList.add("is-invalid");
        feedbackElement.textContent = "O nome da palavra não pode ser vazio.";
        inputElement.style.width = (feedbackElement.textContent.length - 15) + 'ch';
        return;
    }

    if (nomePalavra.length < 2 || nomePalavra.length > 128) {
        inputElement.classList.add("is-invalid");
        feedbackElement.textContent = "O nome da palavra deve ter entre 2 e 128 caracteres.";
        inputElement.style.width = (feedbackElement.textContent.length - 23) + 'ch';
        return;
    }

    let palavras = await API.read(`/usuario/me/palavras`);

    if (palavras.some(p => p.nome.toLowerCase() === nomePalavra.toLowerCase())) {
        inputElement.classList.add("is-invalid");
        feedbackElement.textContent = "Você já adicionou essa palavra-chave.";
        inputElement.style.width = (feedbackElement.textContent.length - 18) + 'ch';
        return;
    }

    adicionando_palavra = false;

    const { status, message } = await API.create(`/usuario/me/palavras`, { nome: nomePalavra });
    
    if (status != "ok") {
        document.getElementById("input_palavra").remove();
        adicionando_palavra = false;
        showToast(message || "Erro ao adicionar palavra-chave");
        return;
    }

    palavras = await API.read(`/usuario/me/palavras`);
    document.getElementById("input_palavra").remove();
    adicionando_palavra = false;

    renderizarPalavras(palavras, "me", "menu");
});

const botao_avaliacoes = document.querySelector(".botao-avaliacoes");
botao_avaliacoes.onclick = async function() {
    if (janela_aberta) return;
    janela_aberta = true;
    botao_avaliacoes.insertAdjacentHTML('beforebegin', `
        <div class="avaliacoes">
        <button type="button" id="fechar_avaliacoes" style="align-self: flex-end;"> <i class="bi bi-x-lg"></i> </button>
        <h2>Avaliações</h2> <div id="media-avaliacao"> ⭐ ${await API.read(`/usuario/me/mediaavaliacao`)}</div>
        <div class="avaliacoes-container">
        
        </div>
    </div>
    `);
    document.getElementById("fechar_avaliacoes").onclick = function() {
        janela_aberta = false;
        document.querySelector(".avaliacoes").remove();
    }
    const container_avaliacao = document.querySelector(".avaliacoes-container");
    const avaliadores = await API.read(`/usuario/me/avaliadores`);
    for (const avaliador of avaliadores) {
        const nome = avaliador.avaliador.nome;
        container_avaliacao.insertAdjacentHTML(`beforeend`, `
            <div class="avaliacao-item">
                <img src="${avaliador.avaliador.foto_de_perfil ? avaliador.avaliador.foto_de_perfil.path : "/imgs/0.jpg"}" alt="Foto do usuário" onclick="window.location.href='perfil.html?id=${avaliador.avaliador.cod}'">
                <div class="avaliacao-conteudo">
                    <span class="avaliacao-nome">${nome}</span>
                    <span class="avaliacao-nota">⭐ ${avaliador.nota}</span>
                    <p class="avaliacao-texto">${avaliador.descricao}</p>
                </div>
            </div>
        `);
    }
}

const botao_denuncias = document.querySelector(".botao-denuncias");
botao_denuncias.onclick = async function() {
    if (janela_aberta) return;
    janela_aberta = true;
    botao_denuncias.insertAdjacentHTML('beforebegin', `
        <div class="denuncias">
        <button type="button" id="fechar_denuncias" style="align-self: flex-end;"> <i class="bi bi-x-lg"></i> </button>
        <h2>Denúncias</h2>
        <div class="denuncias-container">

        </div>
    </div>
    
    `);

    document.getElementById("fechar_denuncias").onclick = function() {
        janela_aberta = false;
        document.querySelector(".denuncias").remove();
    }
    const container_denuncia = document.querySelector(".denuncias-container");
    const denuncias = await API.read(`/usuario/me/denuncia`);

    for (const denuncia of denuncias) {
        container_denuncia.insertAdjacentHTML(`beforeend`, `
            <div class="denuncia-item">
                <img src="${denuncia.denunciadoRef.foto_de_perfil ? denuncia.denunciadoRef.foto_de_perfil.path : "/imgs/0.jpg"}" alt="Foto do usuário" onclick="window.location.href='perfil.html?id=${denuncia.denunciadoRef.cod}'">
                <div class="denuncia-conteudo">
                    <span class="denuncia-nome">${denuncia.denunciadoRef.nome}</span>
                    <span class="denuncia-texto">${denuncia.descricao}</span>
                </div>
            </div>
        `);
    }
}

const botao_uploadfoto = document.getElementById("upload-foto");
const foto_de_perfil = document.getElementById("foto-de-perfil");
const botao_alterarfoto = document.getElementById("alterar-foto");
let novafoto = false;

foto_de_perfil.addEventListener("click", function() {
    botao_uploadfoto.click();
});

botao_uploadfoto.addEventListener("change", async function() {
    if (botao_uploadfoto.files[0].size > 2 * 1024 * 1024) {
        showToast("A foto deve ter no máximo 2MB");
        return;
    }

    if (botao_uploadfoto.files[0].type != "image/jpeg" &&
        botao_uploadfoto.files[0].type != "image/png" &&
        botao_uploadfoto.files[0].type != "image/gif") {
        showToast("A foto deve ser do tipo JPEG, PNG ou GIF");
        return;
    }
    foto_de_perfil.src = URL.createObjectURL(botao_uploadfoto.files[0]);
    novafoto = true;
});

botao_alterarfoto.onclick = async function() {
    const image = new FormData();

    if (botao_uploadfoto.files.length == 0) {
        showToast("Selecione uma foto para alterar");
        return;
    }

    image.append("image", botao_uploadfoto.files[0]);

    let newImage = await api.update("/usuario/me/img", image, true, true);
    
    if (newImage.status != "ok") {
        showToast(newImage.message || "Erro ao atualizar foto de perfil");
        return;
    }
    
    document.getElementById("foto-de-perfil").src = newImage.path;
}

document.querySelector(".botao-logout").onclick = function() {
    Auth.signout();
}

carregarMenu();