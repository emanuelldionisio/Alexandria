import { v4 as uuidv4 } from 'uuid';
import { data } from '../database/data.js';

function create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa }, cod=null) {
    const new_user = { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa };
    for (const [key, val] of Object.entries(new_user)) {
        if (!val && !["tel1", "tel2"].includes(key)) {
            throw new Error(`O campo ${key} é obrigatório`);
        }
    }
    if (data.usuario.find((obj) => obj.email == email)) {
        throw new Error("Usuário com esse email já existe");
    }
    if (! cod) cod = uuidv4();
    new_user.cod = cod;
    data.usuario.push(new_user);
    return new_user;
}

function readById(id) {
    const user = data.usuario.find((obj) => obj.cod == id);
    if (! user) 
        throw new Error("Usuário com esse id não existe");
    return user;
}

export default { create, readById }
