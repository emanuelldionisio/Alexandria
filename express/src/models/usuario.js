import prisma from "../database/database.js";
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.BCRYPT_SALT);

async function create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa }) {
    const data = { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa };
    for (const [key, val] of Object.entries(data)) {
        if (!val && !["tel1", "tel2"].includes(key)) {
            throw new Error(`O campo ${key} é obrigatório`);
        }
    }
    dt_nascimento = new Date(dt_nascimento);

    const hash = await bcrypt.hash(senha, saltRounds);

    if (await prisma.usuario.findUnique({
        where: {
            email: email
        }
    })) {
        throw new Error(`Usuário com email ${email} já existe`);
    }

    const newUser = prisma.usuario.create({
        data: {
            nome,
            tel1,
            tel2,
            email,
            dt_nascimento,
            pais,
            estado,
            cidade,
            bairro,
            rua,
            senha: hash,
            num_casa: Number(num_casa)
        }
    });

    return newUser;
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
    const user = await prisma.usuario.findUnique({
        where: {
            email: email
        },
        select: {
            cod: true,
            senha: true
        }
    });
    if (!user) {
        throw new Error(`Usuário com email ${email} não encontrado`);
    }
    if (! await bcrypt.compare(senha, user.senha)) {
        throw new Error(`Senha incorreta`);
    }
    return user.cod;
}

async function readVendedoresDisponíveis(id_user) {
    const vendedores = await prisma.usuario.findMany({
            where: {
                id_usuario: {
                    not: id_user
                }
            }})
    return vendedores
}

export default { create, readById, readLogin, updateName, readVendedoresDisponíveis }
