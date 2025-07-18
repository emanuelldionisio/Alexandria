import Database from '../database/database.js';

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
    const db = await Database.connect();
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();

    if (!nome) {
        throw new Error('Unable to create keyword');
    } 
    const sql = `
        INSERT INTO
            palavra_chave (nome)
            VALUES
            (?)
        `;
    await db.run(sql, [nome]);
    return {nome};
}

async function deletar(params) {
    const db = await Database.connect();
    const { nome } = params;

    if (!nome) {
        throw new Error("O campo 'nome' é obrigatório");
    }

    const sql = `
        DELETE FROM
            palavra_chave
        WHERE
            nome = ?`;

    await db.run(sql, [nome]);
}
export default { read_all, create, deletar };