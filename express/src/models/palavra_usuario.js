import Database from '../database/database.js';

async function create({ usuario, nome }) {
    if (! usuario || ! nome) {
        throw new Error("Os campos 'usuario' e 'nome' são obrigatórios");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    const db = await Database.connect();
    const sql = `
        INSERT INTO
            palavra_usuario (usuario, palavra)
            VALUES
            (?, ?)
        `;
    await db.run(sql, [usuario, nome]);
    return { usuario, nome };
}

async function readByPalavra(nome) {
    if (!nome) {
        throw new Error("O campo 'nome' é obrigatório");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    const db = await Database.connect();
    const sql = `
        SELECT pu.usuario
        FROM
            palavra_usuario pu
        WHERE
            pu.palavra = ?`;
    return await db.all(sql, [nome]);
}

async function readByUsuarioCod(usuario) {
    if (!usuario) {
        throw new Error("O campo 'usuario' é obrigatório");
    }
    const db = await Database.connect();
    const sql = `
        SELECT pu.palavra
        FROM
            palavra_usuario pu
            join usuario u on (pu.usuario = u.cod)
        WHERE
            u.cod = ?`;
    return await db.all(sql, [usuario]);
}

async function remove({ usuario, nome }) {
    if (!usuario || !nome) {
        throw new Error("Os campos 'usuario' e 'nome' são obrigatórios");
    }
    nome = nome.toLowerCase().replace(/\s+/g, ' ').trim();
    const db = await Database.connect();
    const sql = `
        DELETE FROM
            palavra_usuario
        WHERE
            usuario = ? AND palavra = ?`;
    await db.run(sql, [usuario, nome]);
    return { usuario, nome };
}

export default { create, readByUsuarioCod, remove, readByPalavra };