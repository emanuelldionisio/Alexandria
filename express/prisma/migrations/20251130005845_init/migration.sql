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
    "num_casa" INTEGER NOT NULL,
    "dt_nascimento" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ImagemUsuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    CONSTRAINT "ImagemUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Denuncia" (
    "denunciante" TEXT NOT NULL,
    "denunciado" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("denunciante", "denunciado"),
    CONSTRAINT "Denuncia_denunciante_fkey" FOREIGN KEY ("denunciante") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Denuncia_denunciado_fkey" FOREIGN KEY ("denunciado") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE TABLE "Avaliacao" (
    "cod_avaliador" TEXT NOT NULL,
    "cod_avaliado" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("cod_avaliador", "cod_avaliado"),
    CONSTRAINT "Avaliacao_cod_avaliador_fkey" FOREIGN KEY ("cod_avaliador") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avaliacao_cod_avaliado_fkey" FOREIGN KEY ("cod_avaliado") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Segue" (
    "seguinte" TEXT NOT NULL,
    "seguido" TEXT NOT NULL,

    PRIMARY KEY ("seguinte", "seguido"),
    CONSTRAINT "Segue_seguinte_fkey" FOREIGN KEY ("seguinte") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Segue_seguido_fkey" FOREIGN KEY ("seguido") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraUsuario" (
    "usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    PRIMARY KEY ("usuario", "nome"),
    CONSTRAINT "PalavraUsuario_usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraUsuario_nome_fkey" FOREIGN KEY ("nome") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraLivro" (
    "livro" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    PRIMARY KEY ("livro", "nome"),
    CONSTRAINT "PalavraLivro_livro_fkey" FOREIGN KEY ("livro") REFERENCES "Livro" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraLivro_nome_fkey" FOREIGN KEY ("nome") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PalavraDisco" (
    "disco" TEXT NOT NULL,
    "palavra" TEXT NOT NULL,

    PRIMARY KEY ("disco", "palavra"),
    CONSTRAINT "PalavraDisco_disco_fkey" FOREIGN KEY ("disco") REFERENCES "Disco" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraDisco_palavra_fkey" FOREIGN KEY ("palavra") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "desejos_disco" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "desejos_disco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "desejos_livro" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "desejos_livro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carrinho_disco" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "carrinho_disco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carrinho_livro" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "carrinho_livro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ImagemUsuario_id_usuario_key" ON "ImagemUsuario"("id_usuario");
