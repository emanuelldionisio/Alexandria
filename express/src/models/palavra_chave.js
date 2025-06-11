import { v4 as uuidv4 } from 'uuid';
import { data } from '../database/data.js';

function create({ nome }) {
    const cod = uuidv4();

    const palavra_chave = { nome }

    if (!nome) {
        throw new Error('Unable to create user');
    }

    data.palavra_chave.push(palavra_chave)

    return palavra_chave
}

function read() {
    return data.palavra_chave
}

export default { create, read }
