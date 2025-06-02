const form = document.getElementById("form")
form.onsubmit=async () => { 
    event.preventDefault()
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const id = await fetch(`data/emaid/${email}/${senha}`).then(res=>res.json()).then(data => data.id);
    
    if (!id) {
        alert("Dados incorretos");
        return;
    }

    window.location.href = `inicial.html?id_user=${id}`;
};



