import { data } from '../database/data.js';

function remove({ seguido, seguinte }) {
    if (!seguido || !seguinte) {
        throw new Error("Os campos 'seguido' e 'seguinte' são obrigatórios");
    }
    const index = data.segue.findIndex((obj) => obj.seguido == seguido && obj.seguinte == seguinte);
    if (index === -1) {
        throw new Error('Relação de seguimento não existe');
    }
    data.segue.splice(index, 1);
    return { seguido, seguinte };
}

function create({ seguido, seguinte }) {
    if (!seguido || !seguinte) {
        throw new Error("Os campos 'seguido' e 'seguinte' são obrigatórios");
    }
    if (data.segue.find((obj) => obj.seguido == seguido && obj.seguinte == seguinte)) {
        throw new Error('Relação de seguimento já existe');
    }
    const newSeguimento = { seguido, seguinte };
    data.segue.push(newSeguimento); 
    return { seguido, seguinte };
}

function readSeguidores(id) {
    const seguidores = data.segue.filter((obj) => obj.seguido == id ).map((obj) => { return obj.seguinte});
    return seguidores;
}
function readSeguidos(id) {
    const seguidos = data.segue.filter((obj) => obj.seguinte == id ).map((obj) => { return obj.seguido});
    return seguidos;
}

export default { readSeguidores, remove, readSeguidos, create };

import Database from './database.js';

async function create ({seguinte, seguido}) {
    const db = await Database.connect();

    if (seguinte && seguido) {
        const sql = `
            INSERT INTO
                investments (seguinte, seguido)
            VALUES
                (?,?)
        `
    }

    const { lastID } = await db.run(sql, [seguinte, seguido]);

    return await readById(lastID);
}   else {
    throw new Error('Unable to create investment');
}

export default { up };