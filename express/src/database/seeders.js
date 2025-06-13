import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import Usuario from '../models/usuario.js';
import Segue from '../models/segue.js';
import Palavra from '../models/palavra_chave.js';
import PalavraUsuario from '../models/palavra_usuario.js';

async function up() {
    const file = resolve('src', 'database', 'seeders.json');

    const seed = JSON.parse(readFileSync(file));

    for (const obj of seed.usuario) {
        await Usuario.create(obj, obj.cod);
    }

    for (const obj of seed.segue) {
        await Segue.create(obj);
    }

    for (const obj of seed.palavra_chave) {
        await Palavra.create(obj);
    }

    for (const obj of seed.palavra_usuario) {
        await PalavraUsuario.create(obj);
    }
}

export default { up };