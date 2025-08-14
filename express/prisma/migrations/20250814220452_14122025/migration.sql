/*
  Warnings:

  - You are about to alter the column `dt_nascimento` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
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
INSERT INTO "new_Usuario" ("bairro", "cidade", "cod", "dt_nascimento", "email", "estado", "nome", "num_casa", "pais", "rua", "senha", "tel1", "tel2") SELECT "bairro", "cidade", "cod", "dt_nascimento", "email", "estado", "nome", "num_casa", "pais", "rua", "senha", "tel1", "tel2" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
