import { renderizarProdutos } from "./renderizarProdutos.js";
import { renderizarPalavras } from "./renderizarPalavras.js";

export async function menu_perfil(id, pagina, id_user=-1) {
      
    id_user = id_user == -1 ? id : id_user;
    const palavras = await fetch(`api/usuario/me/palavras`).then(response => response.json());
    const seguidores =  await fetch(`api/usuario/me/seguidores`).then(response => response.json());
    const seguidos = await fetch(`api/usuario/me/seguidos`).then(response => response.json());
    let produtos = await fetch("api/usuario/me/produtos").then(response => response.json());
    
    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = seguidores.length + " seguidores";

    let container_segue = document.getElementById("menu-usuario__informacoes__seguindo");
    container_segue.innerHTML = seguidos.length + " seguindo";

    //Adicionar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    img_fotodeperfil.src = `imgs/usuario/${id}.jpg`;
    img_fotodeperfil.onerror = () => {
        img_fotodeperfil.src = "imgs/usuario/0.jpg";
    };

    renderizarProdutos(produtos, id_user);
    renderizarPalavras(palavras, id, pagina);

    const input_pesquisar = document.getElementById("pesquisar_produtos");

    input_pesquisar.addEventListener("input", async (e) => {
        const valor = e.target.value.toLowerCase();
        produtos = await fetch(`api/usuario/me/produtos?search=${valor}`).then(response => response.json());
        renderizarProdutos(produtos);
    });
}