import Database from "../database/database.js";

async function create(obj, tipo) {
    const db = await Database.connect(); 
    const { id_usuario, nome, valor, condicao, descricao } = obj;
    if (!id_usuario || !nome || !valor || !condicao || !descricao) {
        throw new Error(`Todos os campos são obrigatórios: id_usuario, nome, valor, condicao, descricao`);
    }

    if (tipo == 'disco') {
        const { artista, ano, gravadora } = obj;
        if (!artista || !ano || !gravadora) {
            throw new Error("Campos obrigatórios para disco: artista, ano, gravadora");
        }

        const sql = ` INSERT INTO disco (id_usuario, nome, valor, condicao, descricao, artista, ano, gravadora)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
        
        const { lastID } = await db.run(sql, [id_usuario, nome, valor, condicao, descricao, artista, ano, gravadora])

        return readById(lastID, tipo);

    } else if (tipo == "livro") {
        const { autor, edicao, qtd_pag } = obj;
        if (!autor || !edicao || !qtd_pag) {
            throw new Error("Campos obrigatórios para livro: autor, edicao, qtd_pag");
        }
        const sql = ` INSERT INTO livro (id_usuario, nome, valor, condicao, descricao, autor, edicao, qtd_pag)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
        const { lastID } = await db.run(sql, [id_usuario, nome, valor, condicao, descricao, autor, edicao, qtd_pag]);
        return await readById(lastID, tipo);

    } else {
        throw new Error("Tipo de produto inválido. Deve ser 'disco' ou 'livro'.");
    }
}

async function remove(id_prod, tipo) {
    if (!id_prod || !tipo) {
        throw new Error("Os campos 'id_prod' e 'tipo' são obrigatórios");
    }
    if (tipo !== "disco" && tipo !== "livro") {
        throw new Error("Tipo inválido. Deve ser 'disco' ou 'livro'.");
    }

    const db = await Database.connect();
    if (tipo == "disco") {
        const sql = ` DELETE FROM disco WHERE id_prod = ?`;
        await db.run(sql, [id_prod]);
    
    }
    else if (tipo == "livro") {
        const sql = ` DELETE FROM livro WHERE id_prod = ?`;
        await db.run(sql, [id_prod]);
    }
    return await readById(id_prod, tipo);
}

async function readById(id_prod, tipo) {
    if (!id_prod || !tipo) {
        throw new Error("Os campos 'id_prod' e 'tipo' são obrigatórios");
    }
    if (tipo !== "disco" && tipo !== "livro") {
        throw new Error("Tipo inválido. Deve ser 'disco' ou 'livro'.");
    }

    const db = await Database.connect();
    const sql = ` SELECT * FROM ${tipo} WHERE id_prod = ? `;
    const produto = await db.get(sql, [id_prod]);
    if (!produto) {
        throw new Error(`Produto com id ${id_prod} não encontrado`);
    }
    return produto;
}

async function readByUsuario(id_usuario, modo="incluir") {
    if (!id_usuario) {
        throw new Error("O campo 'id_usuario' é obrigatório");
    }
    if (modo !== "incluir" && modo !== "excluir") {
        throw new Error("Modo inválido. Deve ser 'incluir' ou 'excluir'.");
    }
    const db = await Database.connect();
    if (modo === "incluir") {
        const sql_livro = `
            SELECT * FROM livro
            WHERE id_usuario = ?
        `;
        const sql_disco = `
            SELECT * FROM disco
            WHERE id_usuario = ?
        `;
        const livros = await db.all(sql_livro, [id_usuario]);
        const discos = await db.all(sql_disco, [id_usuario]);
        return {
            "livros": livros,
            "discos": discos
        };
    } else if (modo === "excluir") {
        const sql_livro = `
            SELECT * FROM livro
            WHERE id_usuario != ?
        `;
        const sql_disco = `
            SELECT * FROM disco
            WHERE id_usuario != ?
        `;
        const livros = await db.all(sql_livro, [id_usuario]);
        const discos = await db.all(sql_disco, [id_usuario]);
        return {
            "livros": livros,
            "discos": discos
        };
    }    
}

export default { create, remove, readById, readByUsuario };