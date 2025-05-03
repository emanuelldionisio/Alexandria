
import { segue } from './data/segue.js';

function carregarMenu() {
    let id = 1;
    console.log(id);

    let container_seguidores = document.getElementById("menu-usuario__informacoes__seguidores");
    container_seguidores.innerHTML = segue.filter(obj => obj["seguido"] == id).length + " seguidores";

    let container_segue = document.getElementById("menu-usuario__informacoes__seguindo");
    container_segue.innerHTML = segue.filter(obj => obj["seguinte"] == id).length + " seguindo";


}

carregarMenu()