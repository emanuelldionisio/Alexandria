
export async function menu_perfil(id) {
    const seguidores =  []//await fetch(`data/seguidores/${id}`).then(response => response.json());
    const seguidos = []//await fetch(`data/seguidos/${id}`).then(response => response.json());
    const palavras = []//await fetch(`data/palavra_usuario/${id}`).then(response => response.json());
    const produtos = await fetch(`data/produtoByUsuario?id_usuario=${id}&modo=incluir`).then(response => response.json());
    
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
    let menu_palavras = document.getElementById("menu-palavras-chave__palavras-chave");
    for (let palavra of palavras) {
        let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
        menu_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
            ${palavra}
        </span>`);
    }

    //Adicionar os produtos
    let container_produtos = document.getElementById("menu-produtos__produtos");

    for (let livro of produtos.livros) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${livro.id_prod}&id_user=${id}'">
                <img src="imgs/prod/${livro.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${livro.nome}</h5>
                    <h6>R$ ${(livro.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    for (let disco of produtos.discos) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${disco.id_prod}&id_user=${id}'">
                <img src="imgs/prod/${disco.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${disco.nome}</h5>
                    <h6>R$ ${(disco.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }
}