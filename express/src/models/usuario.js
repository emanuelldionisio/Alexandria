import { v4 as uuidv4 } from 'uuid';
import { data } from '../database/data.js';

function create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa }) {
    const cod = uuidv4();

    const usuario = { cod, nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa }

    if (!cod || !nome || !email || !dt_nascimento || !pais || !estado || !cidade || !bairro || !rua || !senha || !num_casa) {
        throw new Error('Unable to create user');
    }

    data.usuario.push(usuario)

    return usuario
}

export default { create }
