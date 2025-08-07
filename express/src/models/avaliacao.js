import prisma from '../database/database.js';

async function create({ cod_usuario, id_prod, nota, descricao }, tipo) {
    let new_avaliacao;
    if (!cod_usuario || !id_prod || !nota) {
        throw new Error("Os campos 'cod_usuario', 'id_prod' e 'nota' são obrigatórios");
    }
    if (tipo === 'disco') {
        new_avaliacao = await prisma.avaliacaoDisco.create({
            data: {
                cod_usuario,
                id_prod,
                nota,
                descricao
            }
        });
    }
    if (tipo === 'livro') {
        new_avaliacao = await prisma.avaliacaoLivro.create({
            data: {
                cod_usuario,
                id_prod,
                nota,
                descricao
            }
        });
    }
    return new_avaliacao;
}

async function readMediaUsuario(cod_usuario) {
    
    if (!cod_usuario) {
        throw new Error("O campo 'cod_usuario' é obrigatório");
    }
    const qry = await prisma.avaliacaoLivro.aggregate({
        where: {
            livro: {
                id_usuario: cod_usuario
            }
        },
        _avg: {
            nota: true
        },
        _count: {
            nota: true
        }
    });
    let qt_livro = qry._count.nota;
    let avg_livro = qry._avg.nota;

    const qry_disco = await prisma.avaliacaoDisco.aggregate({
        where: {
            disco: {
                id_usuario: cod_usuario
            }
        },
        _avg: {
            nota: true
        },
        _count: {
            nota: true
        }
    });
    let qt_disco = qry_disco._count.nota;
    let avg_disco = qry_disco._avg.nota;

    let ans = qt_disco || qt_livro ? (qt_disco*avg_disco + qt_livro*avg_livro)/(qt_disco + qt_livro) : 0;
    //console.log(qt_disco, avg_disco, qt_livro, avg_livro, ans);
    return (ans).toFixed(1);
    
}

export default { create, readMediaUsuario };