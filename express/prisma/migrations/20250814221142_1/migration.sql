/*
  Warnings:

  - You are about to drop the `AvaliacaoDisco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvaliacaoLivro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AvaliacaoDisco";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AvaliacaoLivro";
PRAGMA foreign_keys=on;

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
