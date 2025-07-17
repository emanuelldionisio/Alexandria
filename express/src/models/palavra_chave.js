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
    if (read_all().find((obj) => obj.nome === nome)) {
        throw new Error('Keyword already exists');
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

async function read_user(cod_usuario) {
    if (!cod_usuario) {
        throw new Error("O campo 'cod_usuario' é obrigatório");
    }
    const db = await Database.connect();

    const sql = `
        SELECT palavra_chave 
        FROM
            palavra_chave
        WHERE
            cod_usuario = ?`

    const palavra= await db.all(sql, [cod_usuario]);
    return palavra
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
export { read_all, create, read_user, deletar };