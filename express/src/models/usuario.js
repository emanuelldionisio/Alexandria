import Database from "../database/database.js";

async function create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa }) {
    const db = await Database.connect();
    const new_user = { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa };
    for (const [key, val] of Object.entries(new_user)) {
        if (!val && !["tel1", "tel2"].includes(key)) {
            throw new Error(`O campo ${key} é obrigatório`);
        }
    }
    
    if (nome && tel1 && email && dt_nascimento && pais && estado && cidade && bairro && rua && senha) {
        const sql = `
            INSERT INTO usuario (nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const { lastID } = await db.run(sql, [nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa]);
        return await readById(lastID);
    } else {
        throw new Error("Erro ao inserir usuário no banco de dados: campos obrigatórios não preenchidos");
    }
    
}

async function updateName(id_user, nome) {
    const db = await Database.connect();
    const sql = `
        UPDATE usuario SET nome = ? WHERE cod = ?
    `;
    await db.run(sql, [nome, id_user]);
    return await readById(id_user);
}

async function readById(id) {
    const db = await Database.connect();
    if (!id) {
        throw new Error("ID do usuário não fornecido");
    }
    const sql = `
        SELECT * FROM usuario WHERE cod = ?
    `;  
    const user = await db.get(sql, [id]);
    if (!user) {
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }
    return user;
}

async function readLogin(senha, email) {
    const db = await Database.connect();
    const query = 'SELECT cod FROM usuario WHERE email = ? AND senha = ?';
    const resultado = await db.get(query, [email, senha]);
    return resultado
}

export default { create, readById, readLogin, updateName }
