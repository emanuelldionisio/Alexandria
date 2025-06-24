import Database from "../database/database.js";

async function create ({seguinte, seguido}) {
    const db = await Database.connect();

    if (!seguinte || !seguido) {
        throw new Error("Campos 'seguinte' e 'seguido' são obrigatórios");
    }
    
    const sql = `
        INSERT INTO
            investments (seguinte, seguido)
        VALUES
            (?,?)
    `;

    const { lastID } = await db.run(sql, [seguinte, seguido]);

    return await readById(lastID);
}

async function remove ({seguinte, seguido}) {
    const db = await Database.connect();

    if (seguinte && seguido) {
        const sql = `
            DELETE FROM 
                segue
            WHERE  
                seguido = ? AND seguinte = ?
        `;
    }

    const { changes } = await db.run(sql, [seguinte, seguido]);

    return changes
}

async function readSeguidores ({seguido}) {
    const db = await Database.connect();

    if (seguido) {
        const sql = `
            SELECT COUNT(*) FROM
                segue
            WHERE
                seguido = ?`
    }
    
    const quantidade = await db.get(sql, [seguido]);
    
    return quantidade;
}

async function readSeguidos ({seguinte}) {
    const db = await Database.connect();

    if (seguinte) {
        const sql = `
            SELECT COUNT(*) FROM
                segue
            WHERE
                seguinte = ?`
    }
    
    const quantidade = await db.get(sql, [seguinte]);
    
    return quantidade;
}

async function readById(id) {
    const db = await Database.connect();

    const sql = `
        SELECT *
        FROM investments
        WHERE id = ?
    `;

    const result = await db.get(sql, [id]);

    if (!result) {
        throw new Error(`Registro com ID ${id} não encontrado`);
    }

    return result;
}

export default { create, remove, readSeguidores, readSeguidos, readById };