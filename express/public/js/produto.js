import API from './services/api.js';
import Auth from './lib/auth.js';

const id = +new URLSearchParams(location.search).get("id_prod");
const tipo = new URLSearchParams(location.search).get("tipo"); 

if (! Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

id ? carregaproduto(id, tipo) : alert("ID do produto inválido na URL."); 

let produto = null;

async function carregaproduto(id, tipo) { 
    try {
        produto = await API.read(`/produto/${id}/${tipo}`);
        
        

        const usuarionome = await API.read(`/usuario/${produto.id_usuario}/nome`);
        const vendedor = await usuarionome;

        preencherPagina(produto, tipo, vendedor);
    } catch (error) {
        alert(error.message || "Erro ao carregar produto");
    }
}


function preencherPagina(produto, tipo, vendedor) {
  document.title = produto.nome;
  document.getElementById("page-titulo").textContent = produto.nome;
  document.getElementById("produto-img").src = `imgs/${tipo}s/${produto.id_prod}.jpg`;
  document.getElementById("produto-desc").textContent = produto.descricao;
  document.getElementById("produto-titulo").textContent = produto.nome;
  document.getElementById("produto-preco").textContent = `R$ ${(produto.valor / 100).toFixed(2).replace('.', ',')}`;
  document.getElementById("vendedor-nome").textContent = vendedor;

  const infoDiv = document.getElementById("produto-info");
  const infoItems = [];

  if (tipo === "livro") {
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

export function irParaPerfil() {
    window.location.href = `perfil.html?id=${produto.id_usuario}`;
}

async function addListaDeDesejos() {
    if (!id_produto || !cod_usuario) {
        alert("ID do produto ou ID do usuário inválido.");
        return;
    }

    try {
        const res = await fetch('/desejos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: id_usuario,
                id_prod: id_prod,
                tipo: tipo
            })
        });
        if (!res.ok) {
            const erro = await res.json();
            throw new Error(erro.message || "Erro ao adicionar produto à lista de desejos");
        }
        const resultado = await res.json();
        alert("Produto adicionado à lista de desejos com sucesso!");
    } catch (error) {
        alert(error.message || "Erro ao adicionar produto à lista de desejos");
    }
}

document.getElementById("btn-adicionar-desejo").addEventListener("click", (event) => {
    event.preventDefault();
    addListaDeDesejos();
});

window.irParaPerfil = irParaPerfil;