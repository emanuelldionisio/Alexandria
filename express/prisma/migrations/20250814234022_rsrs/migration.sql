/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Denuncia" (
    "denunciante" TEXT NOT NULL,
    "denunciado" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("denunciante", "denunciado"),
    CONSTRAINT "Denuncia_denunciante_fkey" FOREIGN KEY ("denunciante") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Denuncia_denunciado_fkey" FOREIGN KEY ("denunciado") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
