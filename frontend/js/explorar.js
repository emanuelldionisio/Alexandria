import { usuario } from './data/usuario.js';
import { palavra_usuario } from './data/palavra_usuario.js';
import { disco } from './data/disco.js';
import { livro } from './data/livro.js';

const params = new URLSearchParams(window.location.search);
//const id = params.get("id_user");

let id = 4;
function selecionarItensAleatorios(itens) {
    const ebaralhados = itens.sort(() => 0.5 - Math.random());
    return embaralhados.slice(0);
}

function carregarMenu() {
    
    //Vizualizar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;

    const coresBootstrap = [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'dark'
    ];
    
                    fetch('itens.json')
                        .then(response => response.json())
                        .then(data => {
                            const selecionados = selecionarItensAleatorios(data);
                            
                            const container = document.getElementById('lista-itens');
                            selecionados.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            container.appendChild(li);
                            });
                        })
                    .catch(error => console.error('Erro ao carregar itens:', error));

    //Procurar por palavras chave
    
    let explorar_palavras = document.getElementById("menu-palavras-chave__palavras-chave");
    for (let palavra of palavras) {
        let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
        explorar_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
            ${palavra.nome}
        </span>`);
    }

    //Apresentar os produtos
    let meus_discos = disco.filter(obj => obj.id_usuario == id);
    let meus_livros = livro.filter(obj => obj.id_usuario == id);
    let container_produtos = document.getElementById("menu-produtos__produtos");

    for (let i of meus_discos) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}'">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${i.nome}</h5>
                    <h6>R$ ${(i.valor/100).toFixed(2)}</h6>
                </div>
            </div>`)
    }

    for (let i of meus_livros) {
        container_produtos.insertAdjacentHTML("beforeend", `<div class="menu-produtos__produtos_produto" onclick="window.location.href = 'produto.html?id_prod=${i.id_prod}'">
                <img src="imgs/prod/${i.id_prod}.jpg" class="card-img-top" alt="...">
                <div>
                    <h5>${i.nome}</h5>
                    <h6>R$ ${(i.valor / 100).toFixed(2)}</h6>
                </div>
            </div>`)
    }
}

export function irParaInicial() {
    window.location.href = `inicial.html?id_user=${id}`;
}
export function irParaPerfil() {
    window.location.href = `perfil.html?id_user=${id}`;
}

window.irParaInicial = irParaInicial;
window.irParaPerfil = irParaPerfil;
carregarMenu()