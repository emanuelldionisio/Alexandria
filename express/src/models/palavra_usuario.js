import prisma from '../database/database.js';

async function create({ usuario, nome }) {
    if (! usuario || ! nome) {
        throw new Error("Os campos 'usuario' e 'nome' são obrigatórios");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    await prisma.palavraUsuario.create({
        data: {
            usuarioRef: {
                connect: { cod: usuario }
            },
            palavraRef: {
                connectOrCreate: {
                    where: {
                        nome: nome
                    },
                    create: {
                        nome: nome
                    }
                }
            }
        }
    });
    return { usuario, nome };
}

async function readByPalavra(nome) {
    if (!nome) {
        throw new Error("O campo 'nome' é obrigatório");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    const usuarios = await prisma.palavraUsuario.findMany({
        where: {
            nome: nome
        },
        select: {
            usuario: true
        }
    });
    return usuarios;
}

async function readByUsuarioCod(usuario) {
    if (!usuario) {
        throw new Error("O campo 'usuario' é obrigatório");
    }
    const palavras = await prisma.palavraUsuario.findMany({
        where: {
            usuarioRef: {
                cod: usuario
            }
        },
        select: {
            nome: true
        }
    })
    
    return palavras;
}

async function remove({ usuario, nome }) {
    if (!usuario || !nome) {
        throw new Error("Os campos 'usuario' e 'nome' são obrigatórios");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    await prisma.palavraUsuario.deleteMany({
        where: {
            usuario: usuario,
            nome: nome
        }
    });
    return { usuario, nome };
}

export default { create, readByUsuarioCod, remove, readByPalavra };