const form = document.getElementById("form")
form.onsubmit=async () => { 
    event.preventDefault()
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const usuario = await fetch(`data/emaid/${email}`).then(res=>res.json())

    if (!usuario) {
    alert("Usuário não encontrado.");
    return;
    }

    const usuario2 = await usuario.json();
    if (usuario.senha === senha) {
    window.location.href = `inicial.html?id_user=${usuario.cod}`;
    } else {
    alert("Senha incorreta.");
    }
};



