import prisma from "../database/database.js";
import fs from 'node:fs/promises';
import pathLib from 'node:path';

async function update(cod_usuario, path) {
    try {
        const existingImage = await prisma.imagemUsuario.findUnique({
            where: { id_usuario: cod_usuario }
        });
        
        if (existingImage) {
            const filename = pathLib.basename(existingImage.path);
            const oldPath = pathLib.resolve('public', 'imgs', filename);
            fs.unlink(oldPath).catch((err) => {
                //console.log(oldPath);
                console.error(`Erro ao deletar a imagem antiga: ${err.message}`);
            });
        }

        const imagemUsuario = await prisma.imagemUsuario.upsert({
            where: { id_usuario: cod_usuario },
            update: { path },
            create: { id_usuario: cod_usuario, path }
        });
        return imagemUsuario;
    } catch (error) {
        throw new Error(`Erro ao atualizar imagem do usuário: ${error.message}`);
    }
}

export default { update };