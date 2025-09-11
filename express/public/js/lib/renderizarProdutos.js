export async function renderizarProdutos(produtos) {
    let container_produtos = document.getElementById("menu-produtos__produtos");
    container_produtos.innerHTML = "";
    for (let livro of produtos.livros) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${livro.id_prod}&tipo=livro'">
                    <img src="imgs/livros/${livro.id_prod}.jpg" class="card-img-top" alt="...">
                    <div>
                        <h5>${livro.nome}</h5>
                        <h6>R$ ${(livro.valor / 100).toFixed(2)}</h6>
                    </div>
                </div>`)
    }

    for (let disco of produtos.discos) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${disco.id_prod}&tipo=disco'">
                    <img src="imgs/discos/${disco.id_prod}.jpg" class="card-img-top" alt="...">
                    <div>
                        <h5>${disco.nome}</h5>
                        <h6>R$ ${(disco.valor / 100).toFixed(2)}</h6>
                    </div>
                </div>`)
    }
}