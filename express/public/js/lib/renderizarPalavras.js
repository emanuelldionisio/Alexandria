import API from '../services/api.js';

export async function renderizarPalavras(palavras, id, pagina) {
    let botao_menu_palavras = document.getElementById("botao_adicionar");
    const coresBootstrap = [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'dark'
    ];
    if (!document.getElementById("menu-palavras-chave__palavras-chave")) {
        if (palavras.length == 0) return;
        botao_menu_palavras.insertAdjacentHTML("beforebegin", `<div class="menu-palavras-chave__palavras-chave" id="menu-palavras-chave__palavras-chave"></div>`);
    } else {
        if (palavras.length == 0) {
            document.getElementById("menu-palavras-chave__palavras-chave").remove();
        }
    }

    if (pagina == "perfil") {
        botao_menu_palavras.remove();
    }

    let menu_palavras = document.getElementById("menu-palavras-chave__palavras-chave");
    menu_palavras.innerHTML = "";
    for (let palavra of palavras) {
        let corAleatoria = coresBootstrap[Math.floor(Math.random() * coresBootstrap.length)];
        if (pagina == "menu") {
            menu_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
                <span>${palavra.nome}</span>
                <i class="bi bi-trash-fill lixo_palavra" id="lixo_palavra_${palavra.nome}"></i>
            </span>`);
            const lixo_palavra = document.getElementById(`lixo_palavra_${palavra.nome}`);
            lixo_palavra.onclick = async function () {
                await API.remove(`/usuario/${id}/palavras/${palavra.nome}`);
                palavras = palavras.filter(p => p.nome !== palavra.nome);
                renderizarPalavras(palavras, id, pagina);
            }
        } else if (pagina == "perfil") {
            menu_palavras.insertAdjacentHTML("beforeend", `<span class="badge rounded-pill text-bg-${corAleatoria} menu-palavras-chave__palavra">
            <span>${palavra.nome}</span>
            <i></i>
            </span>`);
        }
    }
}