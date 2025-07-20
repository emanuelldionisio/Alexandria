const form = document.getElementById("form")
form.onsubmit=async () => { 
    event.preventDefault()
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const id = await fetch(`data/login/${email}/${senha}`, {
        method:"PUT", headers:{"Content-Type": "application/json"}
    }).then(res=>res.json()).then(data => data.cod);
    
    if (!id) {
        alert("Dados incorretos");
        return;
    }

    window.location.href = `inicial.html?id_user=${id}`;
};



