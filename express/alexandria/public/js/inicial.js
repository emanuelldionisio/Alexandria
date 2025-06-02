const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

const livros_disponiveis = await fetch(`data/livro?id_user=${id}&modo='inicial'`).then(response => response.json());
const discos_disponiveis = await fetch(`data/disco?id_user=${id}&modo='inicial'`).then(response => response.json());

function carregarInicial() { 
    // foto do usuário
    let img_perfil = document.getElementById("inicial_perfil");
    img_perfil.src = `imgs/usuario/${id}.jpg`;
    
    // exibição de produtos
    let grid_discos = document.getElementById("grid_discos");
    let grid_livros = document.getElementById("grid_livros");

    for (let i of discos_disponiveis) {
        grid_discos.insertAdjacentHTML("beforeend", `<div class="grid_discos" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}&id_user=${id}'">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="..." >
                <div>
                    <h5> ${i.nome} </h5>
                </div>
            </div>`)
    }

    for (let i of livros_disponiveis) {
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
