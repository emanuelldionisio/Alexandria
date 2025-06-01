
const fetchlogin = (email, senha) => {
    return fetch('./data/usuario.json')
        .then(response => {
            if (!response.ok) {
                throw Error ("Erro")
            }
            return response.json();
        })
        .then(usuario => {
            const validousuario = usuario.find(usuario =>
                usuario.email == email && usuario.senha === senha
            );
            return validousuario|| null;
        })
        .catch(error => {
            console.error("Erro ao logar:", error);
            return null;
        });
};


const form = document.getElementById("form");

form.onsubmit = function() {
    event.preventDefault();
    let email_user = document.getElementById("login").value;
    let user = usuario.find(obj => obj.email == email_user);
    if (!user) {
        alert("Usuario não encontrado");
        return;
    }
    window.location.href = `inicial.html?id_user=${user.cod}`; // Redireciona para a página inicial com o id do usuário
}
