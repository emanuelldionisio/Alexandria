-- CreateTable
CREATE TABLE "PalavraChave" (
    "nome" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Usuario" (
    "cod" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tel1" TEXT NOT NULL,
    "tel2" TEXT,
    "email" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "num_casa" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Livro" (
    "id_prod" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "condicao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "edicao" TEXT NOT NULL,
    "qtd_pag" INTEGER NOT NULL,
    "id_usuario" TEXT NOT NULL,
    CONSTRAINT "Livro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Disco" (
    "id_prod" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "condicao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "gravadora" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    CONSTRAINT "Disco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AvaliacaoLivro" (
    "cod_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("id_prod", "cod_usuario"),
    CONSTRAINT "AvaliacaoLivro_id_prod_fkey" FOREIGN KEY ("id_prod") REFERENCES "Livro" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AvaliacaoLivro_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AvaliacaoDisco" (
    "cod_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("id_prod", "cod_usuario"),
    CONSTRAINT "AvaliacaoDisco_id_prod_fkey" FOREIGN KEY ("id_prod") REFERENCES "Disco" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AvaliacaoDisco_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Segue" (
    "id_seguinte" TEXT NOT NULL,
    "id_seguido" TEXT NOT NULL,

    PRIMARY KEY ("id_seguinte", "id_seguido"),
    CONSTRAINT "Segue_id_seguinte_fkey" FOREIGN KEY ("id_seguinte") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Segue_id_seguido_fkey" FOREIGN KEY ("id_seguido") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraUsuario" (
    "usuarioid" TEXT NOT NULL,
    "palavraid" TEXT NOT NULL,

    PRIMARY KEY ("usuarioid", "palavraid"),
    CONSTRAINT "PalavraUsuario_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraUsuario_palavraid_fkey" FOREIGN KEY ("palavraid") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraLivro" (
    "livroid" TEXT NOT NULL,
    "palavraid" TEXT NOT NULL,

    PRIMARY KEY ("livroid", "palavraid"),
    CONSTRAINT "PalavraLivro_livroid_fkey" FOREIGN KEY ("livroid") REFERENCES "Livro" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraLivro_palavraid_fkey" FOREIGN KEY ("palavraid") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraDisco" (
    "discoid" TEXT NOT NULL,
    "palavraid" TEXT NOT NULL,

    PRIMARY KEY ("discoid", "palavraid"),
    CONSTRAINT "PalavraDisco_discoid_fkey" FOREIGN KEY ("discoid") REFERENCES "Disco" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraDisco_palavraid_fkey" FOREIGN KEY ("palavraid") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
