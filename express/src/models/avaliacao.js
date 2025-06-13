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

function readMediaUsuario(cod_usuario) {
    let sum = 0;
    let count = 0;
    for (const avaliacao of data.avaliacao_disco) {
        if (data.disco.find(disco => disco.id_prod == avaliacao.id_prod && disco.id_usuario == cod_usuario)) {
            sum += avaliacao.nota;
            count++;
        }
    }
    for (const avaliacao of data.avaliacao_livro) {
        if (data.livro.find(livro => livro.id_prod == avaliacao.id_prod && livro.id_usuario == cod_usuario)) {
            sum += avaliacao.nota;
            count++;
        }
    }
    if (count === 0) {
        return 0; 
    }
    return (sum / count).toFixed(1);
    
}

export default { create, readMediaUsuario };