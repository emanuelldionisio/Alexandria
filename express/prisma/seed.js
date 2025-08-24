import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.BCRYPT_SALT);
const prisma = new PrismaClient();

async function main() {
    const file = resolve('prisma', 'seed.json');
    const seed = JSON.parse(readFileSync(file));

    for (const element of seed.usuario) {
        element.dt_nascimento = new Date(element.dt_nascimento);
        element.senha = await bcrypt.hashSync(element.senha, saltRounds);
    };
    
    await prisma.usuario.createMany({
        data: seed.usuario
    });

    await prisma.disco.createMany({
        data: seed.disco
    });

    await prisma.livro.createMany({
        data: seed.livro
    });

    await prisma.palavraChave.createMany({
        data: seed.palavra_chave
    });

    await prisma.avaliacao.createMany({
        data: seed.avaliacao
    });

    await prisma.segue.createMany({
        data: seed.segue
    });

    await prisma.palavraUsuario.createMany({
        data: seed.palavra_usuario
    });

    await prisma.denuncia.createMany({
        data: seed.denuncia
    });
}

main()
    .then(async () => {
    await prisma.$disconnect();
    })
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
    })