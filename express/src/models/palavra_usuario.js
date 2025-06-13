import { data } from '../database/data.js';

function create({ usuario, nome }) {
    const new_palavra_usuario = { usuario, nome };
    if (!usuario || !nome) {
        throw new Error("Os campos 'usuario' e 'nome' são obrigatórios");
    }
    if (data.palavra_usuario.find((obj) => obj.usuario == usuario && obj.nome == nome)) {
        throw new Error('Palavra já existe para este usuário');
    }
    data.palavra_usuario.push(new_palavra_usuario);
    return new_palavra_usuario;
}

function readByUsuario(usuario) {
    const palavras = data.palavra_usuario.filter((obj) => obj.usuario == usuario).map((obj) => obj.nome);
    return palavras;
}


export default { create, readByUsuario };