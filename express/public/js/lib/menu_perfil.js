import { renderizarProdutos } from "./renderizarProdutos.js";
import { renderizarPalavras } from "./renderizarPalavras.js";
import API from '../services/api.js';

export async function menu_perfil(id, pagina) {

    const palavras = await API.read(`/usuario/${id}/palavras`);
    const seguidores =  await API.read(`/usuario/${id}/seguidores`);
    const seguidos = await API.read(`/usuario/${id}/seguidos`);
    let produtos = await API.read(`/usuario/${id}/produtos`);

    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = seguidores.length + " seguidores";

    let container_segue = document.getElementById("menu-usuario__informacoes__seguindo");
    container_segue.innerHTML = seguidos.length + "seguindo";

    //Adicionar a foto de perfil
    let img_fotodeperfil = document.getElementById("foto-de-perfil");
    const path_foto = await API.read(`/usuario/${id}/img`);
    img_fotodeperfil.src = `imgs/usuario/${path_foto}`;
    img_fotodeperfil.onerror = () => {
        img_fotodeperfil.src = "imgs/usuario/0.jpg";
    };

    renderizarProdutos(produtos);
    renderizarPalavras(palavras, id, pagina);

    const input_pesquisar = document.getElementById("pesquisar_produtos");

    input_pesquisar.addEventListener("input", async (e) => {
        const valor = e.target.value.toLowerCase();
        produtos = await API.read(`/usuario/${id}/produtos?search=${valor}`);
        renderizarProdutos(produtos);
    });
}