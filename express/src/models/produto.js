import { data } from "../database/data.js";
import { v4 as uuidv4 } from "uuid";

function create(obj, tipo) {
    const { id_prod, id_usuario, nome, valor, condicao, descricao } = obj;
    if (!id_usuario || !nome || !valor || !condicao || !descricao) {
        throw new Error(`Todos os campos são obrigatórios: id_usuario, nome, valor, condicao, descricao`);
    }

    if (tipo == 'disco') {
        const { artista, ano, gravadora } = obj;
        if (!artista || !ano || !gravadora) {
            throw new Error("Campos obrigatórios para disco: artista, ano, gravadora");
        }
        const disco = {
            id_prod,
            id_usuario,
            nome,
            valor,
            condicao,
            descricao,
            artista,
            ano,
            gravadora,
        };
        disco.id_prod = id_prod || uuidv4(); // Garante que id_prod seja único
        data.disco.push(disco);
        return disco;

    } else if (tipo == "livro") {
        const { autor, edicao, qtd_pag } = obj;
        if (!autor || !edicao || !qtd_pag) {
            throw new Error("Campos obrigatórios para livro: autor, edicao, qtd_pag");
        }
        const livro = {
            id_prod,
            id_usuario,
            nome,
            valor,
            condicao,
            descricao,
            autor,
            edicao,
            qtd_pag,
        };
        livro.id_prod = id_prod || uuidv4(); 
        data.livro.push(livro);
        return livro;

    } else {
        throw new Error("Tipo de produto inválido. Deve ser 'disco' ou 'livro'.");
    }
}

function remove(id_prod) {
    const index = data.produto.findIndex((obj) => obj.id_prod == id_prod);
    if (index === -1) {
        throw new Error("Produto não encontrado");
    }
    const removedProduct = data.produto.splice(index, 1)[0];
    return removedProduct;
}

function readById(id_prod) {
    const produto = data.livro.find((obj) => obj.id_prod == id_prod) || data.disco.find((obj) => obj.id_prod == id_prod);
    if (!produto) {
        throw new Error("Produto não encontrado");
    }
    return produto;
}

function readByUsuario(id_usuario, modo="incluir") {
    if (!id_usuario) {
        throw new Error("O campo 'id_usuario' é obrigatório");
    }
    if (modo !== "incluir" && modo !== "excluir") {
        throw new Error("Modo inválido. Deve ser 'incluir' ou 'excluir'.");
    }

    let produtos = {};

    if (modo == "incluir") 
        produtos = data.livro.filter((obj) => obj.id_usuario == id_usuario).concat(data.disco.filter((obj) => obj.id_usuario == id_usuario));
    else 
        produtos = data.livro.filter((obj) => obj.id_usuario != id_usuario).concat(data.disco.filter((obj) => obj.id_usuario != id_usuario));

    return produtos;
}

/*
"id_prod": 5,
        "id_usuario": 4,
        "nome": "Crime e Castigo",
        "valor": 2390, 
        "condicao": "Bom - Manchas", 
        "descricao": "Possui algumas manchas amareladas nas páginas devido à velhice, sem rasgos ou avarias maiores",
        "autor": "Fiódor Dostoiévski",
        "edicao": "5° - Antofágica",
        "qtd_pag": 592

"id_prod": 4,
        "id_usuario": 1,
        "nome": "Xou da Xuxa - Vinil",
        "valor": 58600,
        "condicao": "Bom", 
        "descricao": "Amarelado pela idade, mas o disco funciona perfeitamente",
        "artista": "Xuxa",
        "ano": 1986,
        "gravadora": "Som Livre"
*/

export default { create, remove, readById, readByUsuario };