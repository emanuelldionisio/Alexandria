import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
    const file = resolve('prisma', 'seed.json');
    const seed = JSON.parse(readFileSync(file));

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

    await prisma.avaliacaoDisco.createMany({
        data: seed.avaliacao_disco
    });

    await prisma.avaliacaoLivro.createMany({
        data: seed.avaliacao_livro
    });

    await prisma.segue.createMany({
        data: seed.segue
    });

    await prisma.palavraUsuario.createMany({
        data: seed.palavra_usuario
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