async function create({nome}) {
    const db = await Database.connect();

    if (!nome) {
        throw new Error('Unable to create keyword');
    }

    const sql = `
        INSERT INTO
            palavra_chave (nome)
        VALUES
            (?)
        `;                                                                            
}

async function read(nome) {
    if (!nome) {
        throw new Error("O campo 'seguinte' é obrigatório");
    }

    const db = await Database.connect();

    const sql = `
        SELECT palavra_chave 
        FROM
            palavra_chave
        WHERE
            nome = ?`

    const palavra= await db.all(sql, [nome]);
    return palavra
}

export default { create, read }