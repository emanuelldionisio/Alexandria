import prisma from '../database/database.js';

async function create({ denunciante, denunciado, descricao }) {
    if (! denunciante || ! denunciado) {
        throw new Error("Campos 'denunciante' e 'denunciado' são obrigatórios");
    }

    try {
        const denuncia = await prisma.denuncia.upsert({
            where: {
                denunciante_denunciado: {
                    denunciante,
                    denunciado
                }
            },
            update: {
                descricao
            },
            create: {
                denunciante,
                denunciado,
                descricao
            }
        });
        return denuncia;
    } catch (error) {
        throw new Error('Error creating denuncia');
    }
}

export default {
    create
};
