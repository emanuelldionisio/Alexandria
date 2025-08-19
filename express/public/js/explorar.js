// Importar dados dos produtos
import { disco } from '../../../explorar/js/data/disco.js';
import { livro } from '../../../explorar/js/data/livro.js';

// Obter ID do usuário da URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id_user');

// Função para formatar string (remover acentos e converter para minúscula)
function formatString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Função para criar o HTML de um item de produto
function criarItemHTML(produto, tipo) {
    const valorFormatado = (produto.valor / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return `
        <div class="item" data-tipo="${tipo}">
            <div class="item-imagem">
                <img src="imgs/${tipo}s/${produto.id_prod}.jpg" alt="${produto.nome}" onerror="this.src='imgs/placeholder.jpg'">
            </div>
            <div class="item-info">
                <h3 class="item-titulo">${produto.nome}</h3>
                <p class="item-autor">${tipo === 'disco' ? produto.artista : produto.autor}</p>
                <p class="item-preco">${valorFormatado}</p>
                <p class="item-condicao">${produto.condicao}</p>
            </div>
        </div>
    `;
}

// Função para carregar todos os produtos na página
function carregarProdutos() {
    const container = document.querySelector('.container-itens-pesquisados');
    
    // Limpar container
    container.innerHTML = '';
    
    // Adicionar todos os livros
    livro.forEach(produto => {
        container.innerHTML += criarItemHTML(produto, 'livro');
    });
    
    // Adicionar todos os discos
    disco.forEach(produto => {
        container.innerHTML += criarItemHTML(produto, 'disco');
    });

    // Adicionar mensagem de "sem resultados" (inicialmente oculta)
    container.innerHTML += `
        <div id="no-results" style="display: none;">
            <p>Nenhum produto encontrado.</p>
        </div>
    `;
}

// Função da barra de pesquisa
function configurarBarraDePesquisa() {
    const input = document.getElementById('search');

    input.addEventListener('input', (event) => {
        const value = formatString(event.target.value);
        
        const Results = document.querySelectorAll('.container-itens-pesquisados .item');
        const noResults = document.getElementById('no-results');

        let temResultado = false;

        Results.forEach((item) => {
            const itemTitulo = item.querySelector('.item-titulo').textContent;
            const itemAutor = item.querySelector('.item-autor').textContent;
            
            // Buscar no título e no autor/artista
            const tituloFormatado = formatString(itemTitulo);
            const autorFormatado = formatString(itemAutor);
            
            if (tituloFormatado.includes(value) || autorFormatado.includes(value)) {
                item.style.display = 'flex';
                temResultado = true;
            } else {
                item.style.display = 'none';
            }
        });

        if (temResultado) {
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    });
}

function carregarMenu() {
    //Vizualizar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;
}

const botao_para_vendedor = document.querySelector(".vendendor");
botao_para_vendendor.onclick = function () {
    window.location.href = `menu.html?id_user=${id_user}`;
}

export function irParaInicial() {
    window.location.href = `inicial.html?id_user=${id}`;
}
export function irParaPerfil() {
    window.location.href = `menu.html?id_user=${id}`;
}

// Função para ir para a página de login
function irParaLogin() {
    window.location.href = 'login.html';
}

// Expor funções para o escopo global
window.irParaInicial = irParaInicial;
window.irParaPerfil = irParaPerfil;
window.irParaLogin = irParaLogin;

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarMenu();
    carregarProdutos();
    configurarBarraDePesquisa();
});