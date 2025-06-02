const id = +new URLSearchParams(location.search).get("id_prod");
id ? carregaproduto(id) : alert("ID do produto inválido na URL.");

let produto = null;

async function carregaproduto(id) {
  try {
    let tipo = null;

    for (const tipoFonte of ['livro', 'disco']) {
      const res = await fetch(`/data/${tipoFonte}?id_prod=${id}`);
      const dados = await res.json();
      produto = dados.find(p => Number(p.id_prod) === id);
      if (produto) {
        tipo = tipoFonte;
        break;
      }
    }

    if (!produto) return alert("Produto não encontrado com id " + id);

    const resUsuario = await fetch(`data/usuario?id_user=${produto.id_usuario}`);
    const vendedor = await resUsuario.json();

    preencherPagina(produto, tipo, vendedor);
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
    alert("Erro ao buscar os dados do produto");
  }
}

function preencherPagina(produto, tipo, vendedor) {
  document.title = produto.nome;
  document.getElementById("page-titulo").textContent = produto.nome;
  document.getElementById("produto-img").src = `imgs/prod/${produto.id_prod}.jpg`;
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