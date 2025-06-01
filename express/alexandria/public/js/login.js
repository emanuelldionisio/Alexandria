document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idUser = params.get('id_user');

  if (!idUser) {
    alert('Usuário não identificado. Faça login.');
    window.location.href = 'login.html';
    return;
  }

  fetch('./data/usuarios.json')
    .then(res => {
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      return res.json();
    })
    .then(usuarios => {
      const usuario = usuarios.find(u => u.cod === Number(idUser));
      if (!usuario) {
        alert('Usuário não encontrado.');
        window.location.href = 'login.html';
        return;
      }
      const perfilImg = document.getElementById('inicial_perfil');
      if (perfilImg) {
        perfilImg.src = usuario.foto || 'imgs/perfis/default.png';
        perfilImg.alt = `Foto de perfil de ${usuario.nome}`;
      }
    })
    .catch(err => {
      console.error('Erro no fetch:', err);
      alert('Erro ao carregar dados do usuário.');
    });
});