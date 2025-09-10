import prisma from "../database/database.js";
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.BCRYPT_SALT);

async function readProdutos(cod, search="") {
    const where = {...search && {contains: search}};
    return await prisma.usuario.findMany({
        where: {
            cod: cod,
        },
        select: {
            livros: {
                where: {
                    nome: where
                }
            },
            discos: {
                where: {
                    nome: where
                }
            }
        }
    })
}

async function readPalavras(cod) {
    return await prisma.usuario.findUnique({
        where: {
            cod: cod
        },
        select: {
            palavras_chave: true
        }
    });
}

async function readSeguidores(cod) {
    return await prisma.usuario.findUnique({
        where: {
            cod: cod
        },
        select: {
            seguidores: true
        }
    });
}

async function readSeguidos(cod) {
    return await prisma.usuario.findUnique({
        where: {
            cod: cod
        },
        select: {
            seguindo: true
        }
    });
}

async function seguir(seguinte, seguido) {
    return await prisma.segue.create({
        data: { seguinte, seguido }
    });
}

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

async function readByEmail(email) { 
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
    return user;
}

async function deixarDeSeguir(seguinte, seguido) {
    return await prisma.segue.deleteMany({
        where: { seguinte, seguido }
    });
}

async function createAvaliacao(cod_avaliador, cod_avaliado, nota, descricao="") {
    await prisma.avaliacao.upsert({
        where: {
            cod_avaliador_cod_avaliado: { cod_avaliador, cod_avaliado }
        },
        update: {
            nota, descricao
        },
        create: {
            cod_avaliador,
            cod_avaliado,
            nota, descricao
        }
    });
}

async function createDenuncia(denunciante, denunciado, descricao) {
    await prisma.denuncia.upsert({
        where: {
            denunciante_denunciado: { denunciante, denunciado }
        },
        update: {
            descricao
        },
        create: {
            denunciante,
            denunciado,
            descricao
        }
    });
}

async function readAvaliadores(id_user) {
    return await prisma.usuario.findUnique({
        where: {
            cod: id_user
        },
        select: {
            avaliado: {
                select: {
                    nota: true,
                    avaliador: {
                        select: {
                            cod: true,
                            nome: true
                        }
                    }
                }
            }
        }
    });
}

async function readDenuncias(id_user) {
    return await prisma.usuario.findUnique({
        where: {
            cod: id_user
        },
        select: {
            denunciou: {
                select: {
                    descricao: true,
                    denunciado: true
                }
            }
        }
    });
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

export default { create, readById, updateName, 
    readVendedoresDisponíveis, readProdutos, 
    readByEmail, readPalavras, readSeguidores,
    readSeguidos, readAvaliadores, readDenuncias,
    seguir, deixarDeSeguir, createAvaliacao, createDenuncia
};
