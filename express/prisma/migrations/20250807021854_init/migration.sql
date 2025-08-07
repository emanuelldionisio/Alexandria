/*
  Warnings:

  - The primary key for the `PalavraDisco` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discoid` on the `PalavraDisco` table. All the data in the column will be lost.
  - You are about to drop the column `palavraid` on the `PalavraDisco` table. All the data in the column will be lost.
  - The primary key for the `PalavraLivro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `livroid` on the `PalavraLivro` table. All the data in the column will be lost.
  - You are about to drop the column `palavraid` on the `PalavraLivro` table. All the data in the column will be lost.
  - The primary key for the `PalavraUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `palavraid` on the `PalavraUsuario` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioid` on the `PalavraUsuario` table. All the data in the column will be lost.
  - The primary key for the `Segue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_seguido` on the `Segue` table. All the data in the column will be lost.
  - You are about to drop the column `id_seguinte` on the `Segue` table. All the data in the column will be lost.
  - Added the required column `disco` to the `PalavraDisco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palavra` to the `PalavraDisco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livro` to the `PalavraLivro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palavra` to the `PalavraLivro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palavra` to the `PalavraUsuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `PalavraUsuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seguido` to the `Segue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seguinte` to the `Segue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PalavraDisco" (
    "disco" TEXT NOT NULL,
    "palavra" TEXT NOT NULL,

    PRIMARY KEY ("disco", "palavra"),
    CONSTRAINT "PalavraDisco_disco_fkey" FOREIGN KEY ("disco") REFERENCES "Disco" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraDisco_palavra_fkey" FOREIGN KEY ("palavra") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "PalavraDisco";
ALTER TABLE "new_PalavraDisco" RENAME TO "PalavraDisco";
CREATE TABLE "new_PalavraLivro" (
    "livro" TEXT NOT NULL,
    "palavra" TEXT NOT NULL,

    PRIMARY KEY ("livro", "palavra"),
    CONSTRAINT "PalavraLivro_livro_fkey" FOREIGN KEY ("livro") REFERENCES "Livro" ("id_prod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraLivro_palavra_fkey" FOREIGN KEY ("palavra") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "PalavraLivro";
ALTER TABLE "new_PalavraLivro" RENAME TO "PalavraLivro";
CREATE TABLE "new_PalavraUsuario" (
    "usuario" TEXT NOT NULL,
    "palavra" TEXT NOT NULL,

    PRIMARY KEY ("usuario", "palavra"),
    CONSTRAINT "PalavraUsuario_usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PalavraUsuario_palavra_fkey" FOREIGN KEY ("palavra") REFERENCES "PalavraChave" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "PalavraUsuario";
ALTER TABLE "new_PalavraUsuario" RENAME TO "PalavraUsuario";
CREATE TABLE "new_Segue" (
    "seguinte" TEXT NOT NULL,
    "seguido" TEXT NOT NULL,

    PRIMARY KEY ("seguinte", "seguido"),
    CONSTRAINT "Segue_seguinte_fkey" FOREIGN KEY ("seguinte") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Segue_seguido_fkey" FOREIGN KEY ("seguido") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "Segue";
ALTER TABLE "new_Segue" RENAME TO "Segue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
