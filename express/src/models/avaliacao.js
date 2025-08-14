import prisma from '../database/database.js';

async function create({ cod_avaliador, cod_avaliado, nota, descricao }) {
    if (!cod_avaliador || !cod_avaliado || !nota || !descricao) {
        throw new Error("Todos os campos são obrigatórios");
    }
    const avaliacao = await prisma.avaliacao.upsert({
        where: {
            cod_avaliador_cod_avaliado: {
                cod_avaliador,
                cod_avaliado
            }
        },
        update: {
            nota,
            descricao
        },
        create: {
            cod_avaliador,
            cod_avaliado,
            nota,
            descricao
        }
    });
    return avaliacao;
}

async function readMediaUsuario(cod_usuario) {
    
    if (!cod_usuario) {
        throw new Error("O campo 'cod_usuario' é obrigatório");
    }
    const qry = await prisma.avaliacao.aggregate({
        where: {
            cod_avaliado: cod_usuario
        },
        _avg: {
            nota: true
        }
    })
    return (qry._avg.nota || 0).toFixed(1);    
}

export default { create, readMediaUsuario };