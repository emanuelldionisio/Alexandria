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

document.getElementById("select-palavras-submit").onclick = function(event) {
    event.preventDefault();
    if (palavras.length >= 5) {
        alert("Você só pode adicionar até 5 palavras-chave.");
        return;
    }
    const palavra = select_palavras.value;
    if (palavra && !palavras.includes(palavra)) {
        palavras.push(palavra);
        container_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)]}" id="badge-${palavra}">${palavra} <i class="bi bi-trash-fill btn-trash"></i></span>`);
        container_palavras.lastElementChild.querySelector(".btn-trash").onclick = function() {
            removerPalavra(palavra, event);
        };
    }
}

document.getElementById("cadastro-produto-form").onsubmit = async function(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;  
    const precoStr = document.getElementById("preco").value.replace(',', '.');
    const preco = parseFloat(precoStr) * 100;
    const tipo = document.querySelector('#midia input[type="radio"]:checked')?.value;
    const autor = document.getElementById("autor").value;
    const gravadora = document.getElementById("gravadora").value;
    const genero = document.getElementById("genero").value;
    const estado = document.getElementById("estado").value;

    if (!titulo || !descricao || isNaN(preco) || preco <= 0 || !tipo || !autor || !gravadora || !genero || !estado) {
        alert("Por favor, preencha todos os campos obrigatórios e insira um preço válido.");
        return;
    }

    const imgInput = document.getElementById("product-img-input");
    const imagem = imgInput.files[0];

    if (!imagem) {
        alert("Selecione uma imagem para o produto.");
        return;
    }

    const id_prod = uuidv4();
    let produto;

    if (tipo === "livro") {
        produto = {
            "id_prod": id_prod,
            "id_usuario": id,
            "nome": titulo,
            "valor": preco,
            "condicao": estado,
            "descricao": descricao,
            "autor": autor,
            "edicao": gravadora,
            "qtd_pag": "null",
            "genero": genero,
            "palavras_chave": palavras
        };
    } else if (tipo === "disco") {
        produto = {
            "id_prod": id_prod,
            "id_usuario": id,
            "nome": titulo,
            "valor": preco,
            "condicao": estado,
            "descricao": descricao,
            "artista": autor,
            "ano": "null",
            "gravadora": gravadora,
            "palavras_chave": palavras
        };
    } else {
        alert("Tipo de mídia inválido.");
        return;
    }

    const formData = new FormData();
    formData.append("imagem", imagem);
    formData.append("produto", JSON.stringify(produto));

    let endpoint = tipo === "livro" ? "data/livro" : "data/disco";
    const response = await fetch(endpoint, {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        window.location.reload();
    } else {
        alert("Erro ao cadastrar produto.");
    }
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