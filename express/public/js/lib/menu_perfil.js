

export async function menu_perfil(id, pagina, id_user=-1) {
    
    async function renderizarProdutos(produtos) {
        let container_produtos = document.getElementById("menu-produtos__produtos");
        container_produtos.innerHTML = "";
        for (let livro of produtos.livros) {
            container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${livro.id_prod}&id_user=${id_user}&tipo=livro'">
                    <img src="imgs/livros/${livro.id_prod}.jpg" class="card-img-top" alt="...">
                    <div>
                        <h5>${livro.nome}</h5>
                        <h6>R$ ${(livro.valor / 100).toFixed(2)}</h6>
                    </div>
                </div>`)
        }
    
        for (let disco of produtos.discos) {
            container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${disco.id_prod}&id_user=${id_user}&tipo=disco'">
                    <img src="imgs/discos/${disco.id_prod}.jpg" class="card-img-top" alt="...">
                    <div>
                        <h5>${disco.nome}</h5>
                        <h6>R$ ${(disco.valor / 100).toFixed(2)}</h6>
                    </div>
                </div>`)
        }
    }

    id_user = id_user == -1 ? id : id_user;
    const palavras = await fetch(`data/palavra_usuario/${id}`).then(response => response.json());
    const seguidores =  await fetch(`data/seguidores/${id}`).then(response => response.json());
    const seguidos = await fetch(`data/seguidos/${id}`).then(response => response.json());
    let produtos = await fetch("data/produtoByUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_usuario: id,
            modo: "incluir",
        })
    }).then(response => response.json());

    const coresBootstrap = [
            'primary', 'secondary', 'success', 'danger',
            'warning', 'info', 'dark'
    ];
    
    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = seguidores.length + " seguidores";

    let container_segue = document.getElementById("menu-usuario__informacoes__seguindo");
    container_segue.innerHTML = seguidos.length + " seguindo";

    //Adicionar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;

    //Adicionar as palavras chave
    let botao_menu_palavras = document.getElementById("botao_adicionar");

    if (palavras.length != 0) {
        botao_menu_palavras.insertAdjacentHTML("beforebegin", `<div class="menu-palavras-chave__palavras-chave" id="menu-palavras-chave__palavras-chave"></div>`);
    }
    
    if (pagina == "perfil") {
        botao_menu_palavras.remove();
    }

    let menu_palavras = document.getElementById("menu-palavras-chave__palavras-chave");
    for (let palavra of palavras) {
        let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
        if (pagina == "menu") {
            menu_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
                <span>${palavra.nome}</span>
                <i class="bi bi-trash-fill lixo_palavra" id="lixo_palavra_${palavra.nome}"></i>
            </span>`);
            const lixo_palavra = document.getElementById(`lixo_palavra_${palavra.nome}`);
            lixo_palavra.onclick = async function() {
                await fetch(`data/palavra_chave/${palavra.nome}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    window.location.reload();
                });
            }
        } else if (pagina == "perfil") {
            menu_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
            <span>${palavra.nome}</span>
            <i></i>
            </span>`);
        }
    }

    renderizarProdutos(produtos, { id });

    const input_pesquisar = document.getElementById("pesquisar_produtos");

    input_pesquisar.addEventListener("input", async (e) => {
        const valor = e.target.value.toLowerCase();
        produtos = await fetch("data/produtoByUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: id,
                modo: "incluir",
                filtros: {
                    nome: valor
                }
            })
        }).then(response => response.json());
        renderizarProdutos(produtos);
    });
}