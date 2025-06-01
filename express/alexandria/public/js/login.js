async function buscarUsuarioPorEmailESenha(email, senha) {

  const response = await fetch('./data/usuarios.json');

  if (!response.ok) throw new Error('Erro ao carregar usuários');

  const usuarios = await response.json();

  return usuarios.find(u => u.email === email && u.senha === senha) || null;
}

const form = document.getElementById('form');

form.onsubmit = async (event) => {
  event.preventDefault();

  const email = document.getElementById('login').value;

  const senha = document.getElementById('senha').value;

  try {
    const usuario = await buscarUsuarioPorEmailESenha(email, senha);

    if (!usuario) {
      alert('Usuario ou senha incorretos');
      return;
    }


    window.location.href = `inicial.html?id_user=${usuario.id}`;
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao processar login');
  }
};
