import prisma from '../database/database.js';

 async function adicionar(id_usuario, id_prod, tipo) {
    try {
      const novoDesejo = await prisma.desejos.create({
        data: {
          id_usuario,
          id_prod,
          tipo
        }
      });
      return novoDesejo;
    } catch (error) {
      throw new Error(`Erro ao adicionar desejo: ${error.message}`);
    }
  }

// Lista desejos de um usuário
  async function listarPorUsuario(id_usuario) {
    try {
      const desejos = await prisma.desejos.findMany({
        where: { id_usuario },
        include: { produto: true } // Inclui informações do produto
      });
      return desejos;
    } catch (error) {
      throw new Error(`Erro ao listar desejos: ${error.message}`);
    }
  }

  export default (adicionar, listarPorUsuario)