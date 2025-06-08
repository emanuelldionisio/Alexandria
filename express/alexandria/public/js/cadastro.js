const params = new URLSearchParams(window.location.search);
const id = params.get("id_user");

if (!id) {
    document.body.innerHTML = "<h1>Verifique se os parâmetros da url são válidos!</h1>";
    throw new Error("Faltam parâmetros na URL: id_user", 400);
}

const container_palavras = document.getElementById("select-palavras");

function carregarPalavras() {
    fetch(`data/palavra_chave`)
        .then(response => response.json())
        .then(palavras => {
            palavras.forEach(palavra => {
                const option = document.createElement("option");
                option.value = palavra.id_palavra;
                option.textContent = palavra.nome;
                container_palavras.appendChild(option);
            });
        })
}

carregarPalavras();