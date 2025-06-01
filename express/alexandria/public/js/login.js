const form = document.getElementById('form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;

  fetch('./data/usuarios.json')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      return response.json();
    })
    .then(usuarios => {
      const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha);

      if (usuarioValido) {
        // Login OK, vai pra página inicial com o id do usuário na URL
        window.location.href = `inicial.html?id_user=${usuarioValido.cod}`;
      } else {
        alert('Email ou senha incorretos!');
      }
    })
    .catch(err => {
      console.error('Erro no fetch:', err);
      alert('Erro ao tentar logar.');
    });
});
