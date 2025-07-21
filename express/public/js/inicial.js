const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

const produtos = await fetch(`data/produtoByUsuario?id_usuario=${id}&modo=excluir`).then(res => res.json());

function carregarInicial() { 
    // foto do usuário
    let img_perfil = document.getElementById("inicial_perfil");
    img_perfil.src = `imgs/usuario/${id}.jpg`;
    
    // exibição de produtos
    let grid_discos = document.getElementById("grid_discos");
    let grid_livros = document.getElementById("grid_livros");

    for (let i of produtos.discos) {
        grid_discos.insertAdjacentHTML("beforeend", `<div class="grid_discos" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}&id_user=${id}'">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="..." >
                <div>
                    <h5> ${i.nome} </h5>
                </div>
            </div>`)
    }

    for (let i of produtos.livros) {
        grid_livros.insertAdjacentHTML("beforeend", `<div class="grid_livros" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}&id_user=${id}'">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${i.nome}</h5>
                </div>
            </div>`)
}
}

export function irParaMenu() {
    window.location.href = `menu.html?id_user=${id}`;
}

window.irParaMenu = irParaMenu;

export function IrParaProduto() {
    window.location.href = `.html?id_user=${id_prod}`;
}

window.IrParaProduto = IrParaProduto;

carregarInicial();
