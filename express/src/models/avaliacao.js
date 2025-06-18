import Database from '../database/database.js';

async function create({ cod_usuario, id_prod, nota, descricao }, tipo) {
    const new_avaliacao = { cod_usuario, id_prod, nota, descricao };
    const db = await Database.connect();
    if (!cod_usuario || !id_prod || !nota) {
        throw new Error("Os campos 'cod_usuario', 'id_prod' e 'nota' são obrigatórios");
    }
    if (tipo === 'disco') {
        const sql = `
            INSERT INTO avaliacao_disco (cod_usuario, id_prod, nota, descricao)
            VALUES (?, ?, ?, ?)
        `;
        const { lastID } = await db.run(sql, [cod_usuario, id_prod, nota, descricao]);
        new_avaliacao.id_avaliacao = lastID;
    }
    if (tipo === 'livro') {
        const sql = `
            INSERT INTO avaliacao_livro (cod_usuario, id_prod, nota, descricao)
            VALUES (?, ?, ?, ?)
        `;
        const { lastID } = await db.run(sql, [cod_usuario, id_prod, nota, descricao]);
        new_avaliacao.id_avaliacao = lastID;
    }
    return new_avaliacao;
}

async function readMediaUsuario(cod_usuario) {
    const dp = await Database.connect();
    if (!cod_usuario) {
        throw new Error("O campo 'cod_usuario' é obrigatório");
    }
    const sql_livro = `
        SELECT count(*) as qt_livro, avg(nota) as avg_livro 
        FROM avaliacao_livro al join livro l on al.id_prod = l.id_prod
        WHERE l.id_usuario = ?
    `;
    const { qt_livro, avg_livro } = await dp.get(sql_livro, [cod_usuario]);
    
    const sql_disco = `
        SELECT count(*) as qt_disco, avg(nota) as avg_disco 
        FROM avaliacao_disco ad join disco d on ad.id_prod = d.id_prod
        WHERE d.id_usuario = ?
    `;
    
    const { qt_disco, avg_disco } = await dp.get(sql_disco, [cod_usuario]);
    
    let ans = qt_disco || qt_livro ? (qt_disco*avg_disco + qt_livro*avg_livro)/(qt_disco + qt_livro) : 0;
    //console.log(qt_disco, avg_disco, qt_livro, avg_livro, ans);
    return (ans).toFixed(1);
    
}

export default { create, readMediaUsuario };