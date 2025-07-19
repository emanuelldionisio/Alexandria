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

    if (!nome) {
        throw new Error('Unable to create keyword');
    } 

    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    console.log(`Creating keyword: ${nome}`);
    const sql = `
        INSERT INTO
            palavra_chave (nome)
            VALUES
            (?)
        `;
    await db.run(sql, [nome]);
    return {nome};
}

async function deletar({ nome }) {
    const db = await Database.connect();

    if (!nome) {
        throw new Error("O campo 'nome' é obrigatório");
    }

    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();

    const sql = `
        DELETE FROM
            palavra_chave
        WHERE
            nome = ?`;

    await db.run(sql, [nome]);
    console.log(`Palavra-chave '${nome}' deletada com sucesso.`);
}
export default { read_all, create, deletar };