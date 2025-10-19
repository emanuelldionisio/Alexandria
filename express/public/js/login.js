import API from "./services/api.js"
import Auth from "./lib/auth.js"

const form = document.getElementById("form")

form.onsubmit = async (event) => {
    event.preventDefault()
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    const { auth, token } = await API.create("/signin", { email, senha });

    if (!auth) {
        alert("Dados incorretos");
        return;
    }

    Auth.signin(token);
};



