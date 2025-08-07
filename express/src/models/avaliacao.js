import prisma from '../database/database.js';

// model AvaliacaoLivro {
//   cod_usuario String
//   id_prod String
//   nota Int
//   descricao String
//   livro Livro @relation(fields: [id_prod], references: [id_prod])
//   usuario Usuario @relation(fields: [cod_usuario], references: [cod])
//   @@id([id_prod, cod_usuario])
// }

// model AvaliacaoDisco {
//   cod_usuario String
//   id_prod String
//   nota Int
//   descricao String
//   disco Disco @relation(fields: [id_prod], references: [id_prod])
//   usuario Usuario @relation(fields: [cod_usuario], references: [cod])
//   @@id(

// model Livro {
//   id_prod String @id @default (uuid())
//   nome String
//   valor Int
//   condicao String
//   descricao String
//   autor String
//   edicao String
//   qtd_pag Int
//   id_usuario String
//   avaliacao AvaliacaoLivro[]
//   vendedor Usuario @relation(fields: [id_usuario], references: [cod])
//   palavras_chave PalavraLivro[]
// }

async function create({ cod_usuario, id_prod, nota, descricao }, tipo) {
    let new_avaliacao;
    if (!cod_usuario || !id_prod || !nota) {
        throw new Error("Os campos 'cod_usuario', 'id_prod' e 'nota' são obrigatórios");
    }
    if (tipo === 'disco') {
        new_avaliacao = await prisma.avaliacaodisco.create({
            data: {
                cod_usuario,
                id_prod,
                nota,
                descricao
            }
        });
    }
    if (tipo === 'livro') {
        new_avaliacao = await prisma.avaliacaolivro.create({
            data: {
                cod_usuario,
                id_prod,
                nota,
                descricao
            }
        });
    }
    return new_avaliacao;
}

async function readMediaUsuario(cod_usuario) {
    if (!cod_usuario) {
        throw new Error("O campo 'cod_usuario' é obrigatório");
    }
    const sql_livro = `
        SELECT count(*) as qt_livro, avg(nota) as avg_livro 
        FROM avaliacao_livro al join livro l on al.id_prod = l.id_prod
        WHERE l.id_usuario = ?
    `;
    const { qt_livro, avg_livro } = await dp.get(sql_livro, [cod_usuario]);
    const qry = await prisma.avaliacaolivro.findMany({
        include: {
            livro: true
        },
        where: {
            livro: {
                id_usuario: cod_usuario
            }
        },
    });
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