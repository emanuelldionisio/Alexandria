import prisma from '../database/database.js';

async function read_all() {
    const db = await Database.connect();

    const sql = `
        SELECT *
        FROM
            palavra_chave`
    
    const palavras = await db.all(sql);
    return palavras;
}

async function create({nome}) {

    if (!nome) {
        throw new Error('Unable to create keyword');
    } 

    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();

    await prisma.palavraChave.create({
        data: {
            nome: nome
        }
    });

    return {nome};
}

async function deletar({ nome }) {

    if (!nome) {
        throw new Error("O campo 'nome' é obrigatório");
    }

    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();

    await prisma.palavraChave.deleteMany({
        where: {
            nome: nome
        }
    });
    
    console.log(`Palavra-chave '${nome}' deletada com sucesso.`);
}
export default { read_all, create, deletar };