const form = document.getElementById("form")
form.onsubmit=async () => { 
    event.preventDefault()
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const id = await fetch(`data/login/${email}/${senha}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(obj => obj.json())
    
    if (!id) {
        alert("Dados incorretos");
        return;
    }

    window.location.href = `inicial.html?id_user=${id["cod"]}`;
};



