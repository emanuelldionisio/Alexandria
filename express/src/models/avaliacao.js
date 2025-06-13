import { data } from '../database/data.js';

function create({ cod_usuario, id_prod, nota, descricao }, tipo) {
    const new_avaliacao = { cod_usuario, id_prod, nota, descricao };
    if (!cod_usuario || !id_prod || !nota) {
        throw new Error("Os campos 'cod_usuario', 'id_prod' e 'nota' são obrigatórios");
    }
    if (tipo === 'disco') {
        data.avaliacao_disco.push(new_avaliacao);
    }
    if (tipo === 'livro') {
        data.avaliacao_livro.push(new_avaliacao);
    }
    return new_avaliacao;
}

export default { create };