import API from "./services/api.js"
import Auth from "./lib/auth.js"
import showToast from "./lib/showToast.js"


const form = document.getElementById("form")



form.onsubmit = async (event) => {
    event.preventDefault()

    const email = document.getElementById("email").value.trim()
    const senha = document.getElementById("senha").value.trim()

   
    if (!email || !senha) {
        showToast("Preencha todos os campos antes de continuar.")
        return
    }

    try {
        const response = await API.create("/signin", { email, senha })
        const { auth, token, message } = response

        if (!auth) {
            showToast(message)
            return
        }

        Auth.signin(token)
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            showToast(error.response.data.message)
        } else {
            showToast("Erro de conexão com o servidor.")
        }
    }
}