import API from './services/api.js';
import Auth from './lib/auth.js';

const id = new URLSearchParams(location.search).get("id_prod");
const tipo = new URLSearchParams(location.search).get("tipo"); 

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id_usuario = Auth.getUserId();


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


async function addCarrinho() {
    console.log("DEBUG CARRINHO:", {
      id_usuario,
      id_prod: produto?.id_prod,
      tipo
    });
    
    if (!id_usuario) {
        alert("Você precisa estar logado para adicionar ao carrinho.");
        return;
    }

    if (!produto || !produto.id_prod) {
        alert("Produto não carregado corretamente.");
        return;
    }

    try {
        const resposta = await API.create("/carrinho", {
            id_usuario: id_usuario,
            id_prod: produto.id_prod,
            tipo: tipo
        });

        alert("Produto adicionado ao carrinho!");

    } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
        alert("Erro: " + err.message);
    }
}

const btnCarrinho = document.getElementById("btn-add-carrinho");

if (btnCarrinho) {
    btnCarrinho.addEventListener("click", (event) => {
        event.preventDefault();
        addCarrinho();
    });
}

window.addCarrinho = addCarrinho;


export function irParaPerfil() {
    window.location.href = `perfil.html?id=${produto.id_usuario}`;
}

async function addListaDeDesejos() {
    if (!produto || !produto.id_prod || !id_usuario) {
        alert("ID do produto ou usuário inválido.");
        return;
    }

    try {
        const resposta = await API.create('/desejos', {
            id_usuario: id_usuario,
            id_prod: produto.id_prod,
            tipo: tipo
        });

        alert("Produto adicionado à lista de desejos com sucesso!");

    } catch (error) {
        console.error("Erro lista de desejos:", error);
        alert(error.message);
    }
}

window.irParaPerfil = irParaPerfil;