
const params = new URLSearchParams(window.location.search);
const idUser = params.get('id_user');

if (!idUser) {
  alert('Usuário não identificado. Faça login.');
  window.location.href = 'login.html';
} else {

  fetch('./data/usuarios.json')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      return response.json();
    })
    .then(usuarios => {

      const usuario = usuarios.find(u => u.cod === Number(idUser));

      if (!usuario) {
        alert('Usuário não encontrado');
        window.location.href = 'login.html';
        return;
      }

      const perfilImg = document.getElementById('inicial_perfil');
      if (perfilImg) {
        perfilImg.src = usuario.foto || 'imgs/perfis/default.png';
        perfilImg.alt = `Foto de perfil de ${usuario.nome}`;
      }



    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao carregar dados do usuário');
    });
}


function irParaMenu() {
  alert(`Abrindo menu do usuário ${idUser}`);

}