async function buscarUsuarioERedirecionar(id) {
  try {
    const response = await fetch(`./data/usuario?id_user=${id}`);
    if (!response.ok) throw new Error('Erro ao buscar usuário');

    const data = await response.json();
    console.log('Usuário:', data);

    window.location.href = `inicial.html?id_user=${id}`;
  } catch (error) {
    console.error('Erro:', error);
  }
}