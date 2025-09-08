const form_cadastro = document.getElementById("form-cadastro");
form_cadastro.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form_cadastro);
    const data = Object.fromEntries(formData);


    await fetch("api/usuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro ao cadastrar usuário, talvez esse email já esteja sendo utilizado");
        }
    });
}