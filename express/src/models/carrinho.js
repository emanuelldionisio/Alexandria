import prisma from '../database/database.js';

// adiciona ao carrinho corretamente
async function adicionar(id_usuario, id_prod, tipo) {
  try {

    if (tipo === "disco") {
      const addcart = await prisma.carrinho_disco.create({
        data: { id_usuario, id_prod }
      });
      return addcart;
    }

    if (tipo === "livro") {
      const addcart = await prisma.carrinho_livro.create({
        data: { id_usuario, id_prod }
      });
      return addcart;
    }

    throw new Error("Tipo inválido: esperado 'disco' ou 'livro'.");

  } catch (error) {
    throw new Error(`Erro ao adicionar ao carrinho: ${error.message}`);
  }
}


async function listarPorUsuario(id_usuario) {
  try {
    const discos = await prisma.carrinho_disco.findMany({
      where: { id_usuario },
      include: { usuario: true }
    });

    const livros = await prisma.carrinho_livro.findMany({
      where: { id_usuario },
      include: { usuario: true }
    });

    return { discos, livros };

  } catch (error) {
    throw new Error(`Erro ao listar carrinho: ${error.message}`);
  }
}

export default { adicionar, listarPorUsuario };
