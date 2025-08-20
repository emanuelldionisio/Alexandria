import prisma from '../database/database.js';

async function create(obj, tipo) {
    const { id_usuario, nome, valor, condicao, descricao } = obj;
    
    if (!id_usuario || !nome || !valor || !condicao || !descricao) {
        throw new Error(`Todos os campos são obrigatórios: id_usuario, nome, valor, condicao, descricao`);
    }

    let produtoData = {
        nome,
        valor: parseInt(valor),
        condicao,
        descricao,
        id_usuario
    };

    if (tipo === 'disco') {
        const { artista, ano, gravadora } = obj;
        if (!artista || !ano || !gravadora) {
            throw new Error("Campos obrigatórios para disco: artista, ano, gravadora");
        }
        
        produtoData = {
            ...produtoData,
            artista,
            ano: parseInt(ano),
            gravadora
        };

        const disco = await prisma.disco.create({
            data: produtoData
        });

        return readById(disco.id_prod, tipo);

    } else if (tipo === "livro") {
        const { autor, edicao, qtd_pag } = obj;
        if (!autor || !edicao || !qtd_pag) {
            throw new Error("Campos obrigatórios para livro: autor, edicao, qtd_pag");
        }

        produtoData = {
            ...produtoData,
            autor,
            edicao,
            qtd_pag: parseInt(qtd_pag)
        };

        const livro = await prisma.livro.create({
            data: produtoData
        });

        return readById(livro.id_prod, tipo);

    } else {
        throw new Error("Tipo de produto inválido. Deve ser 'disco' ou 'livro'.");
    }
}

async function remove(id_prod, tipo) {
    if (!id_prod || !tipo) {
        throw new Error("Os campos 'id_prod' e 'tipo' são obrigatórios");
    }
    if (tipo !== "disco" && tipo !== "livro") {
        throw new Error("Tipo inválido. Deve ser 'disco' ou 'livro'.");
    }

    const produto = await readById(id_prod, tipo);

    if (tipo === "disco") {
        await prisma.disco.delete({
            where: {
                id_prod: id_prod
            }
        });
    } else if (tipo === "livro") {
        await prisma.livro.delete({
            where: {
                id_prod: id_prod
            }
        });
    }

    return produto;
}

async function readById(id_prod, tipo) {
    if (!id_prod || !tipo) {
        throw new Error("Os campos 'id_prod' e 'tipo' são obrigatórios");
    }
    if (tipo !== "disco" && tipo !== "livro") {
        throw new Error("Tipo inválido. Deve ser 'disco' ou 'livro'.");
    }

    let produto;
    if (tipo === "disco") {
        produto = await prisma.disco.findUnique({
            where: {
                id_prod: id_prod
            }
        });
    } else if (tipo === "livro") {
        produto = await prisma.livro.findUnique({
            where: {
                id_prod: id_prod
            }
        });
    }

    if (!produto) {
        throw new Error(`Produto com id ${id_prod} não encontrado`);
    }
    
    return produto;
}

async function readByUsuario(id_usuario, modo = "incluir") {
    if (!id_usuario) {
        throw new Error("O campo 'id_usuario' é obrigatório");
    }
    if (modo !== "incluir" && modo !== "excluir") {
        throw new Error("Modo inválido. Deve ser 'incluir' ou 'excluir'.");
    }

    if (modo === "incluir") {
        const livros = await prisma.livro.findMany({
            where: {
                id_usuario: id_usuario
            }
        });
        const discos = await prisma.disco.findMany({
            where: {
                id_usuario: id_usuario
            }
        });
        return {
            "livros": livros,
            "discos": discos
        };
    } else if (modo === "excluir") {
        const livros = await prisma.livro.findMany({
            where: {
                id_usuario: {
                    not: id_usuario
                }
            }
        });
        const discos = await prisma.disco.findMany({
            where: {
                id_usuario: {
                    not: id_usuario
                }
            }
        });
        return {
            "livros": livros,
            "discos": discos
        };
    }
}

export default { create, remove, readById, readByUsuario };