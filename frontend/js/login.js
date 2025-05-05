export function irParaInicial() {
    let id_user = document.getElementById("login").value;
    window.location.href = `inicial.html?id_user=${id_user}`;
}

window.irParaInicial = irParaInicial;

