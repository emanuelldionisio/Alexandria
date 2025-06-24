import Database from "../database/database.js";

async function create ({ seguinte, seguido }) {
    const db = await Database.connect();

    if (!seguinte || !seguido) {
        throw new Error("Campos 'seguinte' e 'seguido' são obrigatórios");
    }
    
    const sql = `
        INSERT INTO
            segue (seguinte, seguido)
        VALUES
            (?,?)
    `;

    await db.run(sql, [seguinte, seguido]);

    return await readById({seguinte, seguido});
}

async function remove ({seguinte, seguido}) {
    const db = await Database.connect();

    if (!seguinte || !seguido) {
        throw new Error("Campos 'seguinte' e 'seguido' são obrigatórios");
    }

    const sql = `
            DELETE FROM 
                segue
            WHERE  
                seguido = ? AND seguinte = ?
        `;
    

    const { changes } = await db.run(sql, [seguido, seguinte]);

    return changes
}

async function readSeguidores (seguido) {
    const db = await Database.connect();

    if (!seguido) {
        throw new Error("O campo 'seguido' é obrigatório");
    }

    const sql = `
            SELECT seguinte FROM
                segue
            WHERE
                seguido = ?
    `;
        
    const quantidade = await db.all(sql, [seguido]);
    
    return quantidade.map((item) => item.seguinte);
}

async function readSeguidos (seguinte) {
    if (!seguinte) {
        throw new Error("O campo 'seguinte' é obrigatório");
    }

    const db = await Database.connect();

    
    const sql = `
            SELECT seguido FROM
                segue
            WHERE
                seguinte = ?`
    
    
    const quantidade = await db.all(sql, [seguinte]);
    
    return quantidade.map((item) => item.seguido);
}

async function readById({ seguido, seguinte }) {
    if (!seguido || !seguinte) {
        throw new Error("O campo 'id' é obrigatório");
    }

    const db = await Database.connect();
    
    const sql = `
        SELECT *
        FROM segue
        WHERE seguido = ? AND seguinte = ?
    `;

    const result = await db.get(sql, [seguido, seguinte]);

    if (!result) {
        throw new Error(`Registro com ID ${id} não encontrado`);
    }

    return result;
}

export default { create, remove, readSeguidores, readSeguidos, readById };