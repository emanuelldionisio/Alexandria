const id = +new URLSearchParams(location.search).get("id_prod");
id ? carregaproduto(id) : alert("ID do produto inválido na URL.");

const id_user = +new URLSearchParams(location.search).get("id_user");


let produto = null;
let tipo = null; 

async function carregaproduto(id) {
    try {
        const res = await fetch(`data/produto/${id}`);
        if (!res.ok) {
            const erro = await res.json();
            throw new Error(erro.message || "Erro ao carregar produto");
        }

        const dados = await res.json();
        tipo = dados.tipo;
        produto = dados.produto;

        const usuarionome = await fetch ((`data/usuarionome/${id_user}`));
        const vendedor = await usuarionome.json();

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
  document.getElementById("vendedor-nome").textContent = vendedor.nome;

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
    window.location.href = `perfil.html?id_user=${id_user}&id_visitado=${produto.id_usuario}`;
}

window.irParaPerfil = irParaPerfil;