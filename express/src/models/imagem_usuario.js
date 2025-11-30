import prisma from "../database/database.js";

async function create(cod_usuario, path) {
    try {
        const imagemUsuario = await prisma.imagemUsuario.create({
            data: {
                id_usuario: cod_usuario,
                path
            }
        });
        return imagemUsuario;
    } catch (error) {
        throw new Error(`Erro ao adicionar desejo: ${error.message}`);
    }
}

async function update(cod_usuario, path) {
    try {
        const imagemUsuario = await prisma.imagemUsuario.update({
            where: { id_usuario: cod_usuario },
            data: { path }
        });
        return imagemUsuario;
    } catch (error) {
        throw new Error(`Erro ao atualizar imagem do usuário: ${error.message}`);
    }
}

export default { create, update };