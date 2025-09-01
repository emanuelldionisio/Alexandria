import prisma from '../database/database.js';

 async function adicionar(id_usuario, id_prod, tipo) {
    try {
      const Addcart = await prisma.carrinho.create({
        data: {
          id_usuario,
          id_prod,
          tipo
        }
      });
      return Addcart;
    } catch (error) {
      throw new Error(`Erro ao adicionar ao carrinho: ${error.message}`);
    }
  }

// carrinho de um user
  async function listarPorUsuario(id_usuario) {
    try {
      const carrinho = await prisma.carrinho.findMany({
        where: { id_usuario },
        include: { produto: true } // Inclui informações do produto
      });
      return carrinho;
    } catch (error) {
      throw new Error(`Erro ao listar itens no carrinho: ${error.message}`);
    }
  }

  export default (adicionar, listarPorUsuario)