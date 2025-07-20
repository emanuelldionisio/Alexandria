import { menu_perfil } from './lib/menu_perfil.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");
const coresBootstrap = [
    'primary', 'secondary', 'success', 'danger',
    'warning', 'info', 'dark'
];

if (!id) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_user", 400);
}

const nome = await fetch(`data/usuarionome/${id}`).then(response => response.json());


function carregarMenu() {
    menu_perfil(id, "menu");
    //Adicionar o nome do user
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
        <span class= "badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra" >
                <input type="text">
        </span>
    `);
    adicionando_palavra = true;
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
            await fetch(`data/palavra_chave/${nomePalavra}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await fetch(`data/palavra_usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario: id, nome: nomePalavra })
            });
            window.location.reload();
        }
    }
});

carregarMenu()