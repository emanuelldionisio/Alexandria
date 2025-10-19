import API from "./services/api.js"
import Auth from "./lib/auth.js"

const form = document.getElementById("form");

form.onsubmit = async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch(`/login/${email}/${senha}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("Resposta do servidor:", data); 

    if (!res.ok) {
      alert(data.erro || "Erro ao fazer login");
      return;
    }

    const id = data.cod;
    if (!id) {
      alert("Usuário sem código retornado");
      return;
    }

    window.location.href = `inicial.html?id_user=${id}`;
  } catch (err) {
    console.error("Erro de rede:", err);
    alert("Erro ao conectar com o servidor.");
  }
};


