import { usuario } from "./data/usuario.js";
import { disco } from "./data/disco.js";
import { livro } from "./data/livro.js";

let id = 4;

function carregarInicial() { 
    // foto do usuário
    let img_perfil = document.getElementById("inicial_perfil");
    img_perfil.src = `imgs/usuario/${id}.jpg`;
    
    
    // exibição de produtos
    let discos_disponiveis = disco.filter(obj => obj.id_usuario != id);
    let livros_disponiveis = livro.filter(obj => obj.id_usuario != id);
    let grid_discos = document.getElementById("grid_discos");
    let grid_livros = document.getElementById("grid_livros");

    for (let i of discos_disponiveis) {
        grid_discos.insertAdjacentHTML("beforeend", `<div class="grid_discos">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5> ${i.nome} </h5>
                </div>
            </div>`)
    }

    for (let i of livros_disponiveis) {
        grid_livros.insertAdjacentHTML("beforeend", `<div class="grid_livros">
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
carregarInicial();
