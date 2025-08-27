import usuario from "../../src/models/usuario";

const searchInput = document.getElementById("search");

let janela_aberta = false;
const params = new URLSearchParams(window.location.search);
const id_user = params.get("id_user");
const id = params.get("id_visitado");

if ((!id || !id_user)) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_visitado e/ou id_user", 400);
}

if (id == id_user) {
    window.location.href = `menu.html?id_user=${id_user}`;
}

const produtos = await fetch(`data/produtoByUsuario?id_usuario=${id}&modo=excluir`).then(response => response.json());
const vendedores = await fetch(`data/vendedores?id_usuario=${id}`).then(response => response.json());

// Evento de pesquisa
searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    carregarExplorar(query);
});

function carregarExplorar(){
    let container_produtos = document.getElementById("container-produtos");
    let container_usuarios = document.getElementById("container-usuarios");

    for (let livro of produtos.livros) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="produto" onclick="window.location.href = 'produto.html?id_prod=${livro.id_prod}&id_user=${id_user}&tipo=livro'">
                <img src="imgs/livros/${livro.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${livro.nome}</h5>
                    <h6>R$ ${(livro.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    for (let disco of produtos.discos) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="produto" onclick="window.location.href = 'produto.html?id_prod=${disco.id_prod}&id_user=${id_user}&tipo=disco'">
                <img src="imgs/discos/${disco.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${disco.nome}</h5>
                    <h6>R$ ${(disco.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    for (let vendedor of vendedores) {
        container_usuarios.insertAdjacentHTML("beforeend", `<div class="vendedor">
                <img src="imgs/usuario/${vendedor.id}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${vendedor.nome}</h5>
                </div>
            </div>`)
    }

}

carregarExplorar();