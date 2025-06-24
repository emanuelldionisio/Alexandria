import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import Usuario from '../models/usuario.js';
import Segue from '../models/segue.js';
// import Palavra from '../models/palavra_chave.js';
// import PalavraUsuario from '../models/palavra_usuario.js';
import Produto from '../models/produto.js';
import Avaliacao from '../models/avaliacao.js';

async function up() {
    const file = resolve('src', 'database', 'seeders.json');

    const seed = JSON.parse(readFileSync(file));

    for (const obj of seed.usuario) {
        delete obj.cod;
        await Usuario.create(obj, obj.cod);
    }

    for (const obj of seed.disco) {
        await Produto.create(obj, 'disco');
    }

    for (const obj of seed.livro) {
        await Produto.create(obj, 'livro');
    }

    for (const obj of seed.avaliacao_disco) {
        await Avaliacao.create(obj, 'disco');
    }
    
    for (const obj of seed.avaliacao_livro) {
        await Avaliacao.create(obj, 'livro');
    }

    for (const obj of seed.segue) {
        await Segue.create(obj);
    }

}

export default { up };