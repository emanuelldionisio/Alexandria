/*
  Warnings:

  - The primary key for the `PalavraLivro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `palavra` on the `PalavraLivro` table. All the data in the column will be lost.
  - The primary key for the `PalavraUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `palavra` on the `PalavraUsuario` table. All the data in the column will be lost.
  - Added the required column `nome` to the `PalavraLivro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `PalavraUsuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PalavraLivro" (
    "livro" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    PRIMARY KEY ("livro", "nome"),
    CONSTRAINT "PalavraLivro_livro_fkey" FOREIGN KEY ("livro") REFERENCES "Livro" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraLivro_nome_fkey" FOREIGN KEY ("nome") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PalavraLivro" ("livro") SELECT "livro" FROM "PalavraLivro";
DROP TABLE "PalavraLivro";
ALTER TABLE "new_PalavraLivro" RENAME TO "PalavraLivro";
CREATE TABLE "new_PalavraUsuario" (
    "usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    PRIMARY KEY ("usuario", "nome"),
    CONSTRAINT "PalavraUsuario_usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraUsuario_nome_fkey" FOREIGN KEY ("nome") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PalavraUsuario" ("usuario") SELECT "usuario" FROM "PalavraUsuario";
DROP TABLE "PalavraUsuario";
ALTER TABLE "new_PalavraUsuario" RENAME TO "PalavraUsuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
