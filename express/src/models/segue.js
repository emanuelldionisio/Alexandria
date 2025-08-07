import prisma from '../database/database.js';

async function create ({ seguinte, seguido }) {

    if (!seguinte || !seguido) {
        throw new Error("Campos 'seguinte' e 'seguido' são obrigatórios");
    }

    await prisma.segue.create({
        data: {
            seguinte: seguinte,
            seguido: seguido
        }
    });

    return await readById({seguinte, seguido});
}

async function remove ({seguinte, seguido}) {

    if (!seguinte || !seguido) {
        throw new Error("Campos 'seguinte' e 'seguido' são obrigatórios");
    }

    await prisma.segue.deleteMany({
        where: {
            seguido: seguido,
            seguinte: seguinte
        }
    });

    return {seguido, seguinte};
}

async function readSeguidores (seguido) {
    if (!seguido) {
        throw new Error("O campo 'seguido' é obrigatório");
    }
        
    const quantidade = await prisma.segue.findMany({
        where: {
            seguido: seguido
        },
        select: {
            seguinte: true
        }
    });
    
    return quantidade.map((item) => item.seguinte);
}

async function readSeguidos (seguinte) {
    if (!seguinte) {
        throw new Error("O campo 'seguinte' é obrigatório");
    }

    const quantidade = await prisma.segue.findMany({
        where: {
            seguinte: seguinte
        },
        select: {
            seguido: true
        }
    });

    return quantidade.map((item) => item.seguido);
}

async function readById({ seguido, seguinte }) {
    if (!seguido || !seguinte) {
        throw new Error("O campo 'id' é obrigatório");
    }

    const result = await prisma.segue.findUnique({
        where: {
            seguido_seguinte: {
                seguido: seguido,
                seguinte: seguinte
            }
        }
    });

    if (!result) {
        throw new Error(`Registro com ID ${id} não encontrado`);
    }

    return result;
}

export default { create, remove, readSeguidores, readSeguidos, readById };