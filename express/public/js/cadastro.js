import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

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

const select_palavras = document.getElementById("select-palavras");
const container_palavras = document.getElementById("palavras-selecionadas");
let palavras = [];

function removerPalavra(palavra, event) {
    event.preventDefault(); // Previne o comportamento padrão do botão
    palavras = palavras.filter(p => p !== palavra);
    const badge = document.getElementById(`badge-${palavra}`);
    if (badge) {
        badge.remove();
    }
}

document.getElementById("select-palavras-submit").onclick = function() {
    event.preventDefault(); // Previne o comportamento padrão do botão
    const palavra = select_palavras.value;
    if (palavra && !palavras.includes(palavra)) {
        palavras.push(palavra);
        container_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)]}" id="badge-${palavra}">${palavra} <i class="bi bi-trash-fill btn-trash"></i></button></span>`);
        container_palavras.lastElementChild.querySelector(".btn-trash").onclick = function() {
            removerPalavra(palavra);
        };
    }
}

document.getElementById("cadastro-produto-form").onsubmit = async function() {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;  
    const preco = parseFloat(document.getElementById("preco").value)*100;
    const tipo = document.querySelector('#midia input[type="radio"]:checked').value;
    const autor = document.getElementById("autor").value;
    const gravadora = document.getElementById("gravadora").value;
    const genero = document.getElementById("genero").value;
    const estado = document.getElementById("estado").value;

    if (!titulo || !descricao || !preco || !tipo || !autor || !gravadora || !genero || !estado) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    let produto;
    const id_prod = uuidv4();
    if (tipo === "livro") {
      produto = {
        "id_prod": id_prod,
        "id_usuario": id,
        "nome": titulo,
        "valor": preco, // 45.90
        "condicao": estado,
        "descricao": descricao,
        "autor": autor,
        "edicao": gravadora,
        "qtd_pag": "null"
      }
      await fetch(`data/livro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      })
    } else if (tipo === "disco") {
      produto = {
        "id_prod": id_prod,
        "id_usuario": id,
        "nome": titulo,
        "valor": preco, // 59.60
        "condicao": estado,
        "descricao": descricao,
        "artista": autor,
        "ano": "null",
        "gravadora": gravadora
      }
      await fetch(`data/disco`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      })
    }
    window.location.reload();

  
}

function carregarPalavras() {
    fetch(`data/palavra_chave`)
        .then(response => response.json())
        .then(palavras => {
            palavras.forEach(palavra => {
                select_palavras.insertAdjacentHTML("beforeend", `<option value="${palavra.nome}">${palavra.nome}</option>`);
              });
        })
}

carregarPalavras();