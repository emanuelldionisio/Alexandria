import Auth from "./lib/auth.js";
import API from './services/api.js';

const params = new URLSearchParams(window.location.search);

if (!Auth.isAuthenticated()) {
    throw new Error("Usuário não autenticado", 400);
}

const id = params.get("id");

const modo = "excluir";
let produtos = await API.read(`/usuario/me/${modo}/produtos_exibidos`);

async function carregarInicial() { 
   
    // foto do usuário
    let img_fotodeperfil = document.getElementById("inicial_perfil");
    const path_foto = await API.read(`/usuario/${'me'}/img`);
    if (path_foto) {
        img_fotodeperfil.src = `${path_foto}`;
    } else {
        img_fotodeperfil.src = "imgs/usuario/0.jpg";
    };

    // exibição de produtos
    let grid_discos = document.getElementById("grid_discos");
    let grid_livros = document.getElementById("grid_livros");

    for (let i of produtos.discos) {
        grid_discos.insertAdjacentHTML("beforeend", `<div class="grid_discos" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}&id_user=${id}&tipo=disco'">
                <img src="imgs/discos/${i.id_prod}.jpg" class="card-img-top" alt="..." >
                <div>
                    <h5> ${i.nome} </h5>
                </div>
            </div>`)
    }

    for (let i of produtos.livros) {
        grid_livros.insertAdjacentHTML("beforeend", `<div class="grid_livros" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}&id_user=${id}&tipo=livro'">
                <img src="imgs/livros/${i.id_prod}.jpg" class="card-img-top" alt="...">
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
