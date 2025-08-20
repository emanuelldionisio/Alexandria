const searchInput = document.getElementById("search");
const produtosContainer = document.querySelector(".container-produtos");
const vendedoresList = document.querySelector(".lista-vendedores");

// Função para buscar produtos no backend
async function buscarProdutos(query = "") {
    const res = await fetch(`/produtos?search=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
}
// Função para buscar vendedores no backend
async function buscarVendedores(query = "") {
    const res = await fetch(`/vendedores?search=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
}

//----------------
// Renderiza produtos na página
function renderProdutos(produtos) {
    produtosContainer.innerHTML = `<h2>Produtos</h2>`;
    produtos.forEach(prod => {
        produtosContainer.insertAdjacentHTML("beforeend", `
            <div class="produto-card" onclick="window.location.href='produto.html?id_prod=${prod.id_prod}'">
                <img src="imgs/prod/${prod.id_prod}.jpg" alt="${prod.nome}">
                <div>
                    <h5>${prod.nome}</h5>
                    <p>${prod.descricao}</p>
                    <span>R$ ${prod.valor}</span>
                </div>
            </div>
        `);
    });
}

// Renderiza vendedores na página
function renderVendedores(vendedores) {
    vendedoresList.innerHTML = "";
    vendedores.forEach(vend => {
        vendedoresList.insertAdjacentHTML("beforeend", `
            <li>
                <img src="imgs/usuario/${vend.cod}.jpg" alt="${vend.nome}">
                <span>${vend.nome}</span>
            </li>
        `);
    });
}

// Função principal para carregar dados
async function carregarExplorar(query = "") {
    const [produtos, vendedores] = await Promise.all([
        buscarProdutos(query),
        buscarVendedores(query)
    ]);
    renderProdutos(produtos);
    renderVendedores(vendedores);
}

// Eventos de navegação
window.irParaPerfil = function() {
    window.location.href = "perfil.html";
};
window.irParaInicial = function() {
    window.location.href = "inicial.html";
};
window.irParaLogin = function() {
    window.location.href = "login.html";
};

// Evento de pesquisa
searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    carregarExplorar(query);
});

// Carrega dados ao abrir a página
carregarExplorar();
