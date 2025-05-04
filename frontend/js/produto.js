// importando
import { disco } from './data/disco.js';
import { livro } from './data/livro.js';
import { usuario } from './data/usuario.js';


const id = 2;

function carregaproduto() {
    // busca produto
    let produto = livro.find(p => p.id_prod === id);
    let tipo = 'livro';
    if (!produto) {
        produto = disco.find(p => p.id_prod === id);
        tipo = 'disco';
    }

    // título da página
    document.title = produto.nome;
    document.getElementById('page-titulo').textContent = produto.nome;

    // imagem e descrição
    document.getElementById('produto-img').src = `imgs/prod/${produto.id_prod}.jpg`;
    document.getElementById('produto-desc').textContent = produto.descricao;
    document.getElementById('produto-titulo').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = `R$ ${(produto.valor / 100).toFixed(2)}`;

    // nome do vendedor
    const user = usuario.find(u => u.cod === produto.id_usuario);
    document.getElementById('vendedor-nome').textContent = user.nome;

    // informações adicionais
    const infoDiv = document.getElementById('produto-info');
    const infoItems = [];

    if (tipo === 'livro') {
        infoItems.push(`<p><b>Autor:</b> ${produto.autor}</p>`);
        infoItems.push(`<p><b>Edição:</b> ${produto.edicao}</p>`);
        infoItems.push(`<p><b>Páginas:</b> ${produto.qtd_pag}</p>`);
    } else {
        infoItems.push(`<p><b>Artista:</b> ${produto.artista}</p>`);
        infoItems.push(`<p><b>Gravadora:</b> ${produto.gravadora}</p>`);
        infoItems.push(`<p><b>Ano:</b> ${produto.ano}</p>`);
    }

    infoItems.push(`<p><b>Condição:</b> ${produto.condicao}</p>`);
    infoDiv.innerHTML = infoItems.join('');
}
carregaproduto()