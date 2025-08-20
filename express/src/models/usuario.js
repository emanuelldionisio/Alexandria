import prisma from "../database/database.js";
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
    const new_user = await prisma.usuario.update({
        where: {
            cod: id_user
        },
        data: {
            nome: nome
        }
    });
    return await new_user;
}

async function readById(id) {
    if (!id) {
        throw new Error("ID do usuário não fornecido");
    }
    const user = await prisma.usuario.findUnique({
        where: {
            cod: id
        }
    })
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

async function searchVendedores(query = "") {
    return await prisma.usuario.findMany({
        where: {
            nome: { contains: query, mode: "insensitive" }
        },
        select: {
            cod: true,
            nome: true,
            email: true
        }
    });
}

export default { create, readById, readLogin, updateName, searchVendedores }
