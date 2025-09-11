import Auth from './lib/auth.js';
import API from './services/api.js';
import { menu_perfil } from './lib/menu_perfil.js';
import { renderizarPalavras } from './lib/renderizarPalavras.js';
import api from './services/api.js';

let janela_aberta = false;

const coresBootstrap = [
    'primary', 'secondary', 'success', 'danger',
    'warning', 'info', 'dark'
];

if (!Auth.getToken()) {
    document.body.innerHTML = "<h1>Não estás logado!!!!!</h1>";
    throw new Error("Não estás logado!!!!!", 400);
}

const nome = await API.read(`/usuario/me/nome`);

function carregarMenu() {
    menu_perfil("me" ,"menu");
    const mensagem_boasvindas = document.getElementById("menu-usuario__mensagem");
    mensagem_boasvindas.innerHTML = `Olá, ${nome}`;
}

const botao_ir_para_inicial = document.querySelector(".botao-pagina-inicial");

botao_ir_para_inicial.onclick = function() {
    window.location.href = `inicial.html?id_user=${id}`;
}

document.querySelector(".menu-produtos__produtos_adicionar").onclick = function() {
    window.location.href = `cadastro_produto.html?id_user=${id}`;
}

const botao_adicionar_palavra = document.querySelector("#botao_adicionar")
let adicionando_palavra = false;

botao_adicionar_palavra.onclick = function() {
    if (adicionando_palavra) {
        return;
    }
    let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
    botao_adicionar_palavra.insertAdjacentHTML('beforebegin', `
        <span class= "badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra" id="input_palavra">
                <input type="text">
        </span>
    `);
    adicionando_palavra = true;
}

document.getElementById("editar_nome").onclick = function() {
    const nomeUsuario = document.getElementById("menu-usuario__mensagem");
    nomeUsuario.innerHTML = `Olá, <input type="text" id="nome_usuario_input" value="${nome}">`;
    const inputNome = document.getElementById("nome_usuario_input");
    inputNome.style.width = (inputNome.value.length + 2) + 'ch';
    inputNome.focus();
    inputNome.addEventListener('input', function() {
        inputNome.style.width = (inputNome.value.length + 2) + 'ch';
    });
    
    inputNome.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const novoNome = inputNome.value.trim();
            if (novoNome) {
                await API.update(`/usuario/me/nome`, { nome: novoNome });
                nomeUsuario.innerHTML = `Olá, ${novoNome}`;
            }
        }
    });
    
}

document.addEventListener('input', function (e) {
    if (e.target.matches('.menu-palavras-chave__palavra input')) {
        e.target.style.width = (e.target.value.length + 2) + 'ch';
    }
});

document.addEventListener('keydown', async function (e) {
    if (
        e.target.matches('.menu-palavras-chave__palavra input') &&
        e.key === 'Enter' 
    ) {
        adicionando_palavra = false;
        e.preventDefault();
        const nomePalavra = e.target.value.trim();
        if (nomePalavra) {
            await API.create(`/usuario/me/palavras`, { nome: nomePalavra });
            const palavras = await API.read(`/usuario/me/palavras`);
            document.getElementById("input_palavra").remove();
            renderizarPalavras(palavras, "me", "menu");
        }
    }
});

const botao_avaliacoes = document.querySelector(".botao-avaliacoes");
botao_avaliacoes.onclick = async function() {
    if (janela_aberta) return;
    janela_aberta = true;
    botao_avaliacoes.insertAdjacentHTML('beforebegin', `
        <div class="avaliacoes">
        <button type="button" id="fechar_avaliacoes" style="align-self: flex-end;"> <i class="bi bi-x-lg"></i> </button>
        <h2>Avaliações</h2>
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
                <img src="../imgs/usuario/${denuncia.denunciadoRef.foto_perfil}" alt="Foto do usuário" onclick="window.location.href='perfil.html?id_visitado=${denuncia.denunciadoRef.cod}'">
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
    foto_de_perfil.src = URL.createObjectURL(botao_uploadfoto.files[0]);
    novafoto = true;
});

carregarMenu();